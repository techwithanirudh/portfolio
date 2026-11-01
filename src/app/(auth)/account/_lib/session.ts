import { redirect } from 'next/navigation'
import { pages } from '@/constants/pages'
import { getSignInUrl } from '@/lib/auth-url'
import { getSession, type Session } from '@/server/auth'

export async function requireSession(): Promise<Session> {
  const session = await getSession()

  if (!session?.user) {
    redirect(getSignInUrl(pages.account.path))
  }

  return session
}
