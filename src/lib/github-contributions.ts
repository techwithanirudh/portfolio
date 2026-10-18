import 'server-only'

import { unstable_cache } from 'next/cache'
import { z } from 'zod'
// TODO(slopradar): layering: src/lib imports a type from a component, export z.infer of the schema from here and let the component import it
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

const getCachedGitHubContributions = unstable_cache(
  async () => {
    const url = new URL(
      `/v4/${githubUser}?y=last`,
      env.GITHUB_CONTRIBUTIONS_API_URL || DEFAULT_CONTRIBUTIONS_API_URL
    )
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Contributions request failed: ${response.status}`)
    }

    return contributionResponseSchema.parse(await response.json()).contributions
  },
  ['github-contributions', githubUser],
  { revalidate: 60 * 60 * 24 }
)

export const getGitHubContributions = async () => {
  try {
    return await getCachedGitHubContributions()
  } catch (error) {
    console.error('GitHub contributions fetch failed:', error)
    return []
  }
}
