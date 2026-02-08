import { redirect } from 'next/navigation'
import { cache } from 'react'
import { getLoginUrl } from '@/lib/auth-client'
import { getSession } from '@/server/auth'

export const getSessionCached = cache(getSession)

type Session = NonNullable<Awaited<ReturnType<typeof getSession>>>

export async function requireSession(): Promise<Session> {
  const session = await getSessionCached()

  if (!session?.user) {
    redirect(getLoginUrl('/account'))
  }

  return session
}
