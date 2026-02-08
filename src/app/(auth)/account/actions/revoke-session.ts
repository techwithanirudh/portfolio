'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ActionError, actionClient } from '@/lib/safe-action/client'
import { userMiddleware } from '@/lib/safe-action/middleware'
import { RevokeSessionSchema } from '@/lib/validators/session'
import { getSession, revokeSession } from '@/server/auth'

export const revokeSessionAction = actionClient
  .use(userMiddleware)
  .inputSchema(RevokeSessionSchema)
  .action(async ({ parsedInput: { token } }) => {
    const session = await getSession()
    const currentToken = session?.session.token

    try {
      const result = await revokeSession(token)
      if (!result.status) {
        throw new ActionError('Failed to revoke session.')
      }
    } catch {
      throw new ActionError('Failed to revoke session.')
    }

    revalidatePath('/account')

    if (currentToken && token === currentToken) {
      redirect('/')
    }

    return { success: true }
  })
