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

const OVER_FETCH_FACTOR = 3

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

const getFirstLine = (message: string) => {
  const [firstLine] = message.split('\n')
  return firstLine ?? message
}

const getPushEventCommits = async (
  event: GitHubEvent
): Promise<PushCommit[]> => {
  // TODO(slopradar): unchecked-cast: payload casts here and in event.tsx (x8) bypass the Octokit types, narrow on event.type with one typed payload map or a zod schema per event
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
  } catch (error) {
    console.error('GitHub compare commits failed:', error)
    return []
  }
}

// TODO(slopradar): deprecated-api: unstable_cache is replaced by 'use cache' in Next 16 (functions/unstable_cache docs), adopt it with cacheComponents or record why not (owner decision)
const getCachedActivityItems = unstable_cache(
  async (): Promise<ActivityEventItem[]> => {
    if (!env.GITHUB_TOKEN) {
      return []
    }

    const activity = await octokit.rest.activity.listPublicEventsForUser({
      per_page: limit * OVER_FETCH_FACTOR,
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

export const getActivityItems = async (): Promise<ActivityEventItem[]> => {
  let items: ActivityEventItem[]
  try {
    items = await getCachedActivityItems()
  } catch (error) {
    console.error('GitHub activity fetch failed:', error)
    return []
  }

  const closedPullRequests = items.filter(
    ({ event }) =>
      event.type === 'PullRequestEvent' &&
      (event.payload as { action?: string }).action === 'closed'
  )
  if (closedPullRequests.length === 0) {
    return items
  }

  const merged = await getMergedPullRequests()

  return items.map((item) => {
    const number = (
      item.event.payload as { pull_request?: { number?: number } }
    ).pull_request?.number
    const repoName = item.event.repo?.name
    return closedPullRequests.includes(item) && repoName && number
      ? { ...item, merged: merged.has(pullRequestKey(repoName, number)) }
      : item
  })
}
