import { redirect } from 'next/navigation'
import { getSignInUrl } from '@/lib/auth-url'
import { getSession, type Session } from '@/server/auth'

export async function requireSession(): Promise<Session> {
  const session = await getSession()

  if (!session?.user) {
    redirect(getSignInUrl('/account'))
  }

  return session
}
