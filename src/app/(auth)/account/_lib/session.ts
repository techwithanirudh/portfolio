import { redirect } from 'next/navigation'
import { cache } from 'react'
import { getLoginUrl } from '@/lib/auth-client'
import { getSession } from '@/server/auth'

export const getSessionCached = cache(getSession)

export async function requireSession() {
  const session = await getSessionCached()

  if (!session?.user) {
    redirect(getLoginUrl('/account'))
  }

  return session
}
