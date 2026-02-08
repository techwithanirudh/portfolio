'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ActionError, actionClient } from '@/lib/safe-action/client'
import { userMiddleware } from '@/lib/safe-action/middleware'
import { RevokeSessionSchema } from '@/lib/validators/session'
import { getSession, listSessions, revokeSession } from '@/server/auth'

export const revokeSessionAction = actionClient
  .use(userMiddleware)
  .inputSchema(RevokeSessionSchema)
  .action(async ({ parsedInput: { sessionId } }) => {
    const session = await getSession()
    const currentToken = session?.session.token

    const sessions = await listSessions()
    const sessionToRevoke = sessions.find((s) => s.id === sessionId)

    if (!sessionToRevoke?.token) {
      throw new ActionError('Failed to revoke session.')
    }

    const tokenToRevoke = sessionToRevoke.token

    try {
      const result = await revokeSession(tokenToRevoke)
      if (!result.status) {
        throw new ActionError('Failed to revoke session.')
      }
    } catch {
      throw new ActionError('Failed to revoke session.')
    }

    revalidatePath('/account')

    if (currentToken && tokenToRevoke === currentToken) {
      redirect('/')
    }

    return { success: true }
  })
