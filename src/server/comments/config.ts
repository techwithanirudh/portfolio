import type { AuthAdapter } from '@fuma-comment/server'
import { createBetterAuthAdapter } from '@fuma-comment/server/adapters/better-auth'
import { createDrizzleAdapter } from '@fuma-comment/server/adapters/drizzle'
import type { CustomRequest } from '@fuma-comment/server/custom'

import { auth as betterAuth } from '@/server/auth'
import { moderateComment } from '@/server/comments/moderation'
import { db } from '@/server/db'
import { comments, rates, roles, users } from '@/server/db/schema'

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
}
