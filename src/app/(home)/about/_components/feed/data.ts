import { unstable_cache } from 'next/cache'
import { activity, owner } from '@/constants/config'
import { env } from '@/env'
import { octokit } from '@/lib/github'
import type { GitHubEvent, PushCommit } from './event'

const { limit } = activity

interface PushEventPayload {
  before?: string
  head?: string
}

export interface ActivityEventItem {
  commits?: PushCommit[]
  event: GitHubEvent
}

const getFirstLine = (message: string) => {
  const [firstLine] = message.split('\n')
  return firstLine ?? message
}

const getPushEventCommits = async (
  event: GitHubEvent
): Promise<PushCommit[]> => {
  const payload = event.payload as PushEventPayload
  const repoName = event.repo?.name

  if (!(repoName && payload.before && payload.head)) {
    return []
  }

  const [repoOwner, repo] = repoName.split('/')
  if (!(repoOwner && repo)) {
    return []
  }

  try {
    const comparison = await octokit.rest.repos.compareCommits({
      base: payload.before,
      head: payload.head,
      owner: repoOwner,
      repo,
    })

    return comparison.data.commits.slice(0, 3).map((commit) => ({
      message: getFirstLine(commit.commit.message),
      sha: commit.sha,
    }))
  } catch {
    return []
  }
}

const getCachedActivityItems = unstable_cache(
  async (): Promise<ActivityEventItem[]> => {
    if (!env.GITHUB_TOKEN) {
      return []
    }

    try {
      const activity = await octokit.rest.activity.listPublicEventsForUser({
        per_page: limit,
        username: owner,
      })

      const events = activity.data.slice(0, limit)
      const items = await Promise.all(
        events.map(async (event) => ({
          commits:
            event.type === 'PushEvent'
              ? await getPushEventCommits(event)
              : undefined,
          event,
        }))
      )

      return items
    } catch {
      return []
    }
  },
  ['github-activity', owner],
  { revalidate: 5 * 60 }
)

export const getActivityItems = async (): Promise<ActivityEventItem[]> =>
  getCachedActivityItems()
