import type { AuthAdapter, Content } from '@fuma-comment/server'
import { del } from '@vercel/blob'
import { createBetterAuthAdapter } from '@fuma-comment/server/adapters/better-auth'
import { createDrizzleAdapter } from '@fuma-comment/server/adapters/drizzle'
import { and, eq } from 'drizzle-orm'
import type { CustomRequest } from '@fuma-comment/server/custom'

import { auth as betterAuth } from '@/server/auth'
import { db } from '@/server/db'
import { comments, rates, roles, users } from '@/server/db/schema'
import {
  extractCommentImages,
  moderateComment,
} from '@/server/comments/moderation'

export const auth: AuthAdapter<CustomRequest> =
  createBetterAuthAdapter(betterAuth)
const baseStorage = createDrizzleAdapter({
  db,
  schemas: {
    comments,
    rates,
    roles,
    user: users,
  },
  auth: 'better-auth',
})

type PostCommentArgs = Parameters<typeof baseStorage.postComment>[0]
type UpdateCommentArgs = Parameters<typeof baseStorage.updateComment>[0]
type DeleteCommentArgs = Parameters<typeof baseStorage.deleteComment>[0]

export const storage = {
  ...baseStorage,
  postComment: async (options: PostCommentArgs) => {
    await moderateComment(options.body.content)
    return baseStorage.postComment(options)
  },
  updateComment: async (options: UpdateCommentArgs) => {
    await moderateComment(options.body.content)
    return baseStorage.updateComment(options)
  },
  deleteComment: async (options: DeleteCommentArgs) => {
    const [comment] = await db
      .select({ content: comments.content })
      .from(comments)
      .where(
        and(
          eq(comments.id, Number(options.id)),
          eq(comments.page, options.page)
        )
      )
      .limit(1)

    if (comment) {
      const images = extractCommentImages(comment.content as Content)
      for (const url of images) {
        try {
          const parsed = new URL(url)
          if (parsed.pathname.startsWith('/comments/')) {
            await del(url)
          }
        } catch (error) {
          console.error('Failed to delete comment image:', {
            url,
            error:
              error instanceof Error
                ? { name: error.name, message: error.message }
                : String(error),
          })
        }
      }
    }

    return baseStorage.deleteComment(options)
  },
}
