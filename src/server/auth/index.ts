import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, multiSession } from 'better-auth/plugins'
import { headers } from 'next/headers'
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
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
})

export const getSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  })
}

export const listSessions = async () => {
  return await auth.api.listSessions({
    headers: await headers(),
  })
}

export const revokeSession = async (token: string) => {
  return await auth.api.revokeSession({
    body: {
      token,
    },
    headers: await headers(),
  })
}
