import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  client: {
    NEXT_PUBLIC_BASE_URL: z.url().optional(),
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
    // TODO(slopradar): env default in caller: github-contributions.ts falls back with `||`, put the default here as z.url().default('https://github-contributions-api.jogruber.de') and drop the caller fallback
    GITHUB_CONTRIBUTIONS_API_URL: z.url().optional(),
    GITHUB_TOKEN: z.string().min(1).startsWith('github_pat_').optional(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    HACKCLUB_API_KEY: z.string().min(1).startsWith('sk-hc-'),
    OPENAI_API_KEY: z.string().min(1).startsWith('sk-proj-'),
    RESEND_API_KEY: z.string().min(1).startsWith('re_').optional(),
    RESEND_AUDIENCE_ID: z.string().min(1).optional(),
  },
  shared: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
