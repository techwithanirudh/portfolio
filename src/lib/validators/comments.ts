import { z } from 'zod'

const CommentMentionContentSchema = z.object({
  attrs: z.object({
    id: z.string(),
    label: z.string().optional(),
  }),
  type: z.literal('mention'),
})

export const parseCommentMentionNode = (node: unknown) => {
  const result = CommentMentionContentSchema.safeParse(node)
  return result.success ? result.data : null
}
