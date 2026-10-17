import 'server-only'

import { unstable_cache } from 'next/cache'
import { z } from 'zod'
import type { Activity } from '@/components/features/contributions'
import { githubUser } from '@/constants/config'
import { env } from '@/env'

const contributionResponseSchema = z.object({
  contributions: z.array(
    z.object({ count: z.number(), date: z.string(), level: z.number() })
  ),
}) satisfies z.ZodType<{ contributions: Activity[] }>

const DEFAULT_CONTRIBUTIONS_API_URL =
  'https://github-contributions-api.jogruber.de'

export const getGitHubContributions = unstable_cache(
  async () => {
    const url = new URL(
      `/v4/${githubUser}?y=last`,
      env.GITHUB_CONTRIBUTIONS_API_URL || DEFAULT_CONTRIBUTIONS_API_URL
    )
    try {
      const response = await fetch(url)

      if (!response.ok) {
        return []
      }

      const parsed = contributionResponseSchema.safeParse(await response.json())

      return parsed.success ? parsed.data.contributions : []
    } catch {
      return []
    }
  },
  ['github-contributions', githubUser],
  { revalidate: 60 * 60 * 24 }
)
