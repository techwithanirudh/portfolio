'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSession, listSessions, revokeSession } from '@/server/auth'

export async function revokeSessionAction(options: { token: string }) {
  const { token } = options

  const session = await getSession()
  const currentToken = session?.session.token
  if (!currentToken) {
    return { ok: false as const }
  }

  try {
    const sessions = await listSessions()
    const isUsersSession = sessions.some((s) => s.token === token)
    if (!isUsersSession) {
      return { ok: false as const }
    }
  } catch {
    return { ok: false as const }
  }

  try {
    const result = await revokeSession(token)

    if (!result.status) {
      return { ok: false as const }
    }
  } catch {
    return { ok: false as const }
  }

  revalidatePath('/account')

  if (token === currentToken) {
    redirect('/')
  }

  return { ok: true as const }
}
