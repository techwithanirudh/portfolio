import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { isAPIError } from 'better-auth/api'
import { admin, multiSession } from 'better-auth/plugins'
import { headers } from 'next/headers'
import { cache } from 'react'
import { env } from '@/env'
import { db } from '@/server/db'

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  plugins: [admin(), multiSession()],
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
})

export const getSession = cache(async () =>
  auth.api.getSession({
    headers: await headers(),
  })
)

export type Session = NonNullable<Awaited<ReturnType<typeof getSession>>>
export type SessionUser = Session['user']

export const isSessionNotFreshError = (error: unknown) =>
  isAPIError(error) && error.body?.code === 'SESSION_NOT_FRESH'

export const listSessions = async () =>
  auth.api.listSessions({
    headers: await headers(),
  })

export const revokeSession = async (token: string) =>
  auth.api.revokeSession({
    body: {
      token,
    },
    headers: await headers(),
  })
