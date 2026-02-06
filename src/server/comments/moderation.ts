import { type Content, RouteError } from '@fuma-comment/server'
import { del } from '@vercel/blob'
import { generateText, Output, type UserContent } from 'ai'
import { moderationPrompt } from '@/lib/ai/prompts/moderation'
import {
  ModerationResultSchema,
  parseCommentImageNode,
  parseCommentMentionNode,
} from '@/lib/validators'
import { provider } from '@/lib/ai/providers'

const normalizeWhitespace = (value: string) =>
  value.replace(/\s+/g, ' ').trim()

const extractContent = (content: Content) => {
  const textParts: string[] = []
  const images: string[] = []

  const visit = (node: Content) => {
    if (node.type === 'text' && typeof node.text === 'string') {
      textParts.push(node.text)
    }

    const parsedImage = parseCommentImageNode(node)
    if (parsedImage) {
      images.push(parsedImage.attrs.src)
    }

    const parsedMention = parseCommentMentionNode(node)
    if (parsedMention) {
      textParts.push(`@${parsedMention.attrs.label ?? parsedMention.attrs.id}`)
    }

    if (Array.isArray(node.content)) {
      for (const child of node.content) {
        visit(child)
      }
    }

    if (node.type === 'paragraph') {
      textParts.push('\n')
    }
  }

  visit(content)

  return {
    text: normalizeWhitespace(textParts.join(' ')),
    images,
  }
}

export const extractCommentImages = (content: Content) => {
  return extractContent(content).images
}

export const moderateComment = async (content: Content) => {
  const { text, images } = extractContent(content)

  if (images.length > 0) {
    throw new RouteError({
      statusCode: 400,
      message: 'Images are not allowed in comments.',
    })
  }

  const userContent: UserContent = [
    {
      type: 'text',
      text: `Moderate this comment:\n\n${text || '[no text content]'}`,
    },
  ]

  const { output } = await generateText({
    model: provider.languageModel('moderation-model'),
    system: moderationPrompt,
    output: Output.object({
      schema: ModerationResultSchema,
    }),
    messages: [
      {
        role: 'user',
        content: userContent,
      },
    ],
  })

  if (!output.allowed) {
    throw new RouteError({ statusCode: 400, message: output.reason })
  }

  return output
}
