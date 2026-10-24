import { type Content, RouteError } from '@fuma-comment/server'
import { parseCommentMentionNode } from '@/lib/validators/comments'
import { moderate } from '@/server/moderation'

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
    text: textParts
      .join('')
      .split('\n')
      .map((line) => line.replace(/[^\S\n]+/g, ' ').trim())
      .filter(Boolean)
      .join('\n'),
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

  const result = await moderate(
    `Moderate this comment:\n\n${text || '[no text content]'}`,
    'Comment'
  )
  if (!result) {
    throw new RouteError({
      message: 'Could not verify content safety. Please try again.',
      statusCode: 500,
    })
  }
  if (!result.allowed) {
    throw new RouteError({ message: result.reason, statusCode: 400 })
  }

  return result
}
