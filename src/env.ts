import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  client: {
    NEXT_PUBLIC_BASE_URL:
      process.env.NODE_ENV === 'production' ? z.url() : z.url().optional(),
    NEXT_PUBLIC_UMAMI_URL: z.url().optional(),
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.uuid().optional(),
  },
  emptyStringAsUndefined: true,

  experimental__runtimeEnv: {
    // Previews have no NEXT_PUBLIC_BASE_URL, and the browser cannot see
    // VERCEL_PROJECT_PRODUCTION_URL, so the last fallback keeps the client schema satisfied
    NEXT_PUBLIC_BASE_URL:
      process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'https://www.imanirudh.com'),
    NEXT_PUBLIC_UMAMI_URL: process.env.NEXT_PUBLIC_UMAMI_URL,
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
    NODE_ENV: process.env.NODE_ENV,
  },

  server: {
    ANALYZE: z.string().optional(),
    BETTER_AUTH_SECRET:
      process.env.NODE_ENV === 'production'
        ? z.string().min(1)
        : z.string().min(1).optional(),
    BETTER_AUTH_URL: z.string().min(1).optional(),
    BLOB_READ_WRITE_TOKEN: z.string().min(1).startsWith('vercel_blob_rw_'),
    BOTID_DEV_BYPASS: z.enum(['BAD-BOT', 'GOOD-BOT', 'HUMAN']).optional(),
    DATABASE_URL: z.url(),
    EMAIL_FROM: z.email().optional(),
    EMAIL_TO: z.email().optional(),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GITHUB_CONTRIBUTIONS_API_URL: z.url().optional(),
    GITHUB_TOKEN: z.string().min(1).startsWith('github_pat_').optional(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    HACKCLUB_API_KEY: z.string().min(1).startsWith('sk-hc-'),
    OPENAI_API_KEY: z.string().min(1).startsWith('sk-proj-'),
    RESEND_API_KEY: z.string().min(1).startsWith('re_').optional(),
    RESEND_AUDIENCE_ID: z.string().min(1).optional(),
    SOURCE_MAPS: z.string().optional(),
  },
  shared: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
