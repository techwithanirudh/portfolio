import { z } from 'zod'

export const CommentImageContentSchema = z.object({
  type: z.literal('image'),
  attrs: z.object({
    src: z.string().startsWith('http'),
    width: z.number(),
    height: z.number(),
    alt: z.string().optional(),
  }),
})

export const CommentMentionContentSchema = z.object({
  type: z.literal('mention'),
  attrs: z.object({
    id: z.string(),
    label: z.string().optional(),
  }),
})

export type CommentImageContent = z.infer<typeof CommentImageContentSchema>
export type CommentMentionContent = z.infer<typeof CommentMentionContentSchema>

export const parseCommentImageNode = (node: unknown) => {
  const result = CommentImageContentSchema.safeParse(node)
  return result.success ? result.data : null
}

export const parseCommentMentionNode = (node: unknown) => {
  const result = CommentMentionContentSchema.safeParse(node)
  return result.success ? result.data : null
}
