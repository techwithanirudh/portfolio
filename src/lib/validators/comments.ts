import { z } from 'zod'

export const CommentImageContentSchema = z.object({
  attrs: z.object({
    alt: z.string().optional(),
    height: z.number(),
    src: z.string().startsWith('http'),
    width: z.number(),
  }),
  type: z.literal('image'),
})

export const CommentMentionContentSchema = z.object({
  attrs: z.object({
    id: z.string(),
    label: z.string().optional(),
  }),
  type: z.literal('mention'),
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
