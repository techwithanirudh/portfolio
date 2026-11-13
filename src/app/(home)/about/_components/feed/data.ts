import { unstable_cache } from 'next/cache'
import { activity, githubUser } from '@/constants/config'
import { env } from '@/env'
import { octokit } from '@/lib/github'
import {
  type GitHubEvent,
  isSupportedEvent,
  type PushCommit,
} from './event-types'

const { limit } = activity

interface PushEventPayload {
  before?: string
  head?: string
}

interface ActivityEventItem {
  commits?: PushCommit[]
  event: GitHubEvent
  merged?: boolean
}

const pullRequestKey = (repoName: string, number: number) =>
  `${repoName}#${number}`

const getCachedMergedPullRequests = unstable_cache(
  async (): Promise<string[]> => {
    const { data } = await octokit.rest.search.issuesAndPullRequests({
      per_page: 100,
      q: `is:pr is:merged author:${githubUser}`,
      sort: 'updated',
    })

    return data.items.map((item) =>
      pullRequestKey(item.repository_url.split('/repos/')[1] ?? '', item.number)
    )
  },
  ['github-merged-pull-requests', githubUser],
  { revalidate: 5 * 60 }
)

const getMergedPullRequests = async (): Promise<Set<string>> => {
  try {
    return new Set(await getCachedMergedPullRequests())
  } catch (error) {
    console.error('GitHub merged pull requests fetch failed:', error)
    return new Set()
  }
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
      message: commit.commit.message.split('\n')[0] ?? commit.commit.message,
      sha: commit.sha,
    }))
  } catch (error) {
    console.error('GitHub compare commits failed:', error)
    return []
  }
}

const getCachedActivityItems = unstable_cache(
  async (): Promise<ActivityEventItem[]> => {
    if (!env.GITHUB_TOKEN) {
      return []
    }

    const activity = await octokit.rest.activity.listPublicEventsForUser({
      // The filter drops event types the feed doesn't show, so fetch extra
      per_page: limit * 3,
      username: githubUser,
    })

    const events = activity.data.filter(isSupportedEvent).slice(0, limit)

    return Promise.all(
      events.map(async (event) => ({
        commits:
          event.type === 'PushEvent'
            ? await getPushEventCommits(event)
            : undefined,
        event,
      }))
    )
  },
  ['github-activity', githubUser],
  { revalidate: 5 * 60 }
)

const isClosedPullRequest = ({ event }: ActivityEventItem) =>
  event.type === 'PullRequestEvent' &&
  (event.payload as { action?: string }).action === 'closed'

export const getActivityItems = async (): Promise<ActivityEventItem[]> => {
  let items: ActivityEventItem[]
  try {
    items = await getCachedActivityItems()
  } catch (error) {
    console.error('GitHub activity fetch failed:', error)
    return []
  }

  if (!items.some(isClosedPullRequest)) {
    return items
  }

  const merged = await getMergedPullRequests()

  return items.map((item) => {
    const number = (
      item.event.payload as { pull_request?: { number?: number } }
    ).pull_request?.number
    const repoName = item.event.repo?.name
    return isClosedPullRequest(item) && repoName && number
      ? { ...item, merged: merged.has(pullRequestKey(repoName, number)) }
      : item
  })
}
