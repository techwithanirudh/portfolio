'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ActionError, userActionClient } from '@/lib/safe-action'
import { RevokeSessionSchema } from '@/lib/validators/session'
import { getSession, revokeSession } from '@/server/auth'

export const revokeSessionAction = userActionClient
  .inputSchema(RevokeSessionSchema)
  .action(async ({ parsedInput: { token } }) => {
    const session = await getSession()
    const currentToken = session?.session.token

    const result = await revokeSession(token)
    if (!result.status) {
      console.error('Failed to revoke session')
      throw new ActionError(
        "Couldn't revoke that session. Refresh the page and try again."
      )
    }

    revalidatePath('/account')

    if (currentToken && token === currentToken) {
      redirect('/')
    }

    return { success: true }
  })
