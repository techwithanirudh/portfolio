import { unstable_cache } from 'next/cache'
import { activity, owner } from '@/constants/config'
import { octokit } from '@/lib/github'
import type { GitHubEvent, PushCommit } from './event'

const { limit } = activity

interface PushEventPayload {
  before?: string
  head?: string
}

export interface ActivityEventItem {
  event: GitHubEvent
  commits?: PushCommit[]
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
      owner: repoOwner,
      repo,
      base: payload.before,
      head: payload.head,
    })

    return comparison.data.commits.slice(0, 3).map((commit) => ({
      sha: commit.sha,
      message: getFirstLine(commit.commit.message),
    }))
  } catch {
    return []
  }
}

const getCachedActivityItems = unstable_cache(
  async (): Promise<ActivityEventItem[]> => {
    const activity = await octokit.rest.activity.listPublicEventsForUser({
      username: owner,
      per_page: limit,
    })

    const events = activity.data.slice(0, limit)
    const items = await Promise.all(
      events.map(async (event) => ({
        event,
        commits:
          event.type === 'PushEvent'
            ? await getPushEventCommits(event)
            : undefined,
      }))
    )

    return items
  },
  ['github-activity', owner],
  { revalidate: 5 * 60 }
)

export const getActivityItems = async (): Promise<ActivityEventItem[]> =>
  getCachedActivityItems()
