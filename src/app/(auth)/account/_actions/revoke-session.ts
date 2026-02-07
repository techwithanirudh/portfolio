'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSession, listSessions, revokeSession } from '@/server/auth'

export async function revokeSessionAction(options: { token: string }) {
  const { token } = options

  const session = await getSession()
  const currentToken = session?.session.token
  if (!currentToken) {
    return { ok: false }
  }

  try {
    const sessions = await listSessions()
    const isUsersSession = sessions.some((s) => s.token === token)
    if (!isUsersSession) {
      return { ok: false }
    }
  } catch {
    return { ok: false }
  }

  try {
    const result = await revokeSession(token)

    if (!result.status) {
      return { ok: false }
    }
  } catch {
    return { ok: false }
  }

  revalidatePath('/account')

  if (token === currentToken) {
    redirect('/')
  }

  return { ok: true }
}
