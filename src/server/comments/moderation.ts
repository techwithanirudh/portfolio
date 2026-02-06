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
import { moderateImageUrl } from '@/lib/ai/moderation/image'

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

const cleanupRejectedImage = async (url: string) => {
  try {
    const parsed = new URL(url)
    if (parsed.pathname.startsWith('/comments/')) {
      await del(url)
    }
  } catch (error) {
    console.error('Failed to delete rejected comment image blob:', {
      url,
      error:
        error instanceof Error
          ? { name: error.name, message: error.message }
          : String(error),
    })
  }
}

export const moderateComment = async (content: Content) => {
  const { text, images } = extractContent(content)

  for (const url of images) {
    try {
      const imageModeration = await moderateImageUrl(url)
      if (!imageModeration.allowed) {
        await cleanupRejectedImage(url)
        throw new RouteError({
          statusCode: 400,
          message: imageModeration.reason,
        })
      }
    } catch (error) {
      if (error instanceof RouteError) {
        throw error
      }
      console.error('Comment image moderation failed:', {
        url,
        error:
          error instanceof Error
            ? { name: error.name, message: error.message }
            : String(error),
      })
      await cleanupRejectedImage(url)
      throw new RouteError({
        statusCode: 400,
        message: 'Could not verify image safety. Please try again.',
      })
    }
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
