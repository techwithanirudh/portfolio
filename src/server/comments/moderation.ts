import { type Content, RouteError } from '@fuma-comment/server'
import { generateText, Output, type UserContent } from 'ai'
import { moderationPrompt } from '@/lib/ai/prompts/moderation'
import { provider } from '@/lib/ai/providers'
import {
  ModerationResultSchema,
  parseCommentImageNode,
  parseCommentMentionNode,
} from '@/lib/validators'

const normalizeWhitespace = (value: string) =>
  value
    .split('\n')
    .map((line) => line.replace(/[^\S\n]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')

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
    images,
    text: normalizeWhitespace(textParts.join('')),
  }
}

export const extractCommentImages = (content: Content) =>
  extractContent(content).images

export const moderateComment = async (content: Content) => {
  const { text, images } = extractContent(content)

  if (images.length > 0) {
    throw new RouteError({
      message: 'Images are not allowed in comments.',
      statusCode: 400,
    })
  }

  const userContent: UserContent = [
    {
      text: `Moderate this comment:\n\n${text || '[no text content]'}`,
      type: 'text',
    },
  ]

  try {
    const { output } = await generateText({
      messages: [
        {
          content: userContent,
          role: 'user',
        },
      ],
      model: provider.languageModel('moderation-model'),
      output: Output.object({
        schema: ModerationResultSchema,
      }),
      system: moderationPrompt,
    })

    if (!output) {
      throw new RouteError({
        message: 'Could not verify content safety. Please try again.',
        statusCode: 500,
      })
    }

    if (!output.allowed) {
      throw new RouteError({ message: output.reason, statusCode: 400 })
    }

    return output
  } catch (error) {
    if (error instanceof RouteError) {
      throw error
    }

    console.error('Comment moderation failed:', {
      error:
        error instanceof Error
          ? { message: error.message, name: error.name }
          : String(error),
    })

    throw new RouteError({
      message: 'Could not verify content safety. Please try again.',
      statusCode: 500,
    })
  }
}
