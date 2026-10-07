import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  client: {
    // App
    NEXT_PUBLIC_BASE_URL: z.url().min(1).optional(),
    // Analytics
    NEXT_PUBLIC_UMAMI_URL: z.url().optional(),
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.uuid().optional(),
  },
  emptyStringAsUndefined: true,

  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL:
      process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : undefined),
    NEXT_PUBLIC_UMAMI_URL: process.env.NEXT_PUBLIC_UMAMI_URL,
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
    NODE_ENV: process.env.NODE_ENV,
  },

  server: {
    // Authentication
    BETTER_AUTH_SECRET:
      process.env.NODE_ENV === 'production'
        ? z.string().min(1)
        : z.string().min(1).optional(),
    BETTER_AUTH_URL: z.string().min(1).optional(),
    // Vercel Blob
    BLOB_READ_WRITE_TOKEN: z.string().min(1).startsWith('vercel_blob_rw_'),
    // BotID
    BOTID_DEV_BYPASS: z.enum(['BAD-BOT', 'GOOD-BOT', 'HUMAN']).optional(),
    // Database
    DATABASE_URL: z.string().url(),
    EMAIL_FROM: z.email(),
    EMAIL_TO: z.email(),
    // Github
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GITHUB_TOKEN: z.string().min(1).startsWith('github_pat_'),
    // Google
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    HACKCLUB_API_KEY: z.string().min(1).startsWith('sk-hc-'),
    // OpenAI
    OPENAI_API_KEY: z.string().min(1).startsWith('sk-proj-'),
    // Resend
    RESEND_API_KEY: z.string().min(1).startsWith('re_'),
    RESEND_AUDIENCE_ID: z.string().min(1),
  },
  shared: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
