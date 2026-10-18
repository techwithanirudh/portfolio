import { type Content, RouteError } from '@fuma-comment/server'
import { generateText, Output } from 'ai'
import { moderationPrompt } from '@/lib/ai/prompts/moderation'
import { provider } from '@/lib/ai/providers'
import {
  ModerationResultSchema,
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
  let hasImage = false

  const visit = (node: Content) => {
    if (node.type === 'text' && typeof node.text === 'string') {
      textParts.push(node.text)
    }

    if (node.type === 'image') {
      hasImage = true
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
    hasImage,
    text: normalizeWhitespace(textParts.join('')),
  }
}

export const moderateComment = async (content: Content) => {
  const { hasImage, text } = extractContent(content)

  if (hasImage) {
    throw new RouteError({
      message: 'Images are not allowed in comments.',
      statusCode: 400,
    })
  }

  // TODO(slopradar): duplication: same generateText + Output.object(ModerationResultSchema) + console.error + 'Could not verify content safety' fallback as app/(home)/guestbook/actions/utils/moderation.ts, extract one shared moderate() and one message constant
  try {
    const { output } = await generateText({
      instructions: moderationPrompt,
      model: provider.languageModel('moderation-model'),
      output: Output.object({
        schema: ModerationResultSchema,
      }),
      prompt: `Moderate this comment:\n\n${text || '[no text content]'}`,
    })

    if (!output.allowed) {
      throw new RouteError({ message: output.reason, statusCode: 400 })
    }

    return output
  } catch (error) {
    if (error instanceof RouteError) {
      throw error
    }

    // TODO(slopradar): inconsistent-error-handling: logs only name and message, so the stack, cause and NoObjectGeneratedError.text are lost, while safe-action/client.ts logs the error whole; log `error` itself (same in the guestbook moderation copy)
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
