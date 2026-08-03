import 'server-only'

import { unstable_cache } from 'next/cache'
import type { Activity } from '@/components/kibo-ui/contribution-graph'
import { baseOptions } from '@/constants/site'

interface ContributionResponse {
  contributions: Activity[]
}

const githubUsername = baseOptions.githubUrl?.split('/').filter(Boolean).at(-1)

export const getGitHubContributions = unstable_cache(
  async () => {
    if (!githubUsername) {
      return []
    }

    const url = new URL(
      `/v4/${githubUsername}?y=last`,
      process.env.GITHUB_CONTRIBUTIONS_API_URL ||
        'https://github-contributions-api.jogruber.de'
    )
    const response = await fetch(url)

    if (!response.ok) {
      return []
    }

    const data = (await response.json()) as ContributionResponse

    return data.contributions ?? []
  },
  ['github-contributions', githubUsername ?? 'unknown'],
  { revalidate: 60 * 60 * 24 }
)
