import type { ComponentType } from 'react'
import { Icons } from '@/components/icons/icons'
import { formatDate } from '@/lib/format-date'
import type { GitHubEvent, PushCommit } from './event-types'

interface IssuesPayload {
  action?:
    | 'opened'
    | 'edited'
    | 'closed'
    | 'reopened'
    | 'assigned'
    | 'unassigned'
    | 'labeled'
    | 'unlabeled'
  issue?: {
    title?: string
    number?: number
  }
}

interface PullRequestPayload {
  action?: string
  pull_request?: {
    title?: string
    number?: number
    user?: {
      login?: string
    }
  }
}

interface CreatePayload {
  ref?: string | null
  ref_type?: 'branch' | 'repository' | 'tag'
}

const EventDate = ({ date }: { date: string | null }) => {
  if (!date) {
    return <div className='shrink-0 text-muted-foreground'>Recently</div>
  }

  return (
    <div className='shrink-0 text-muted-foreground'>{formatDate(date)}</div>
  )
}

const getRepoName = (event: GitHubEvent) => event.repo?.name ?? 'a repository'

const commitListFormat = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
})

const EventRow = ({
  date,
  description,
  icon: EventIcon,
}: {
  date: string | null | undefined
  description: string
  icon: ComponentType<{ className?: string }>
}) => (
  <div className='flex items-center gap-4'>
    <EventIcon className='icon-tilt-reverse size-4 shrink-0 text-muted-foreground' />
    <div className='min-w-0 flex-1 truncate' title={description}>
      {description}
    </div>
    <EventDate date={date ?? null} />
  </div>
)

interface EventDescription {
  description: string
  icon: ComponentType<{ className?: string }>
}

const describePush = (
  event: GitHubEvent,
  commits: PushCommit[] | undefined
): EventDescription => {
  const repoName = getRepoName(event)
  const commitMessages = commits?.map((commit) => commit.message) ?? []
  const commitCount = commitMessages.length
  let description = `Pushed commits to ${repoName}`

  if (commitCount > 0) {
    const list = commitListFormat.format(commitMessages)
    const commitLabel = commitCount === 1 ? 'commit' : 'commits'
    description = `Pushed ${commitCount} ${commitLabel} to ${repoName}: ${list}`
  }

  return { description, icon: Icons.gitCommit }
}

const pullRequestVerb = ({ action }: PullRequestPayload, merged: boolean) => {
  switch (action) {
    case 'opened':
      return 'Opened'
    case 'reopened':
      return 'Reopened'
    case 'closed':
      return merged ? 'Merged' : 'Closed'
    default:
      return 'Updated'
  }
}

const describePullRequest = (
  event: GitHubEvent,
  merged: boolean
): EventDescription => {
  const payload = event.payload as PullRequestPayload
  const pullRequest = payload.pull_request
  const repoName = getRepoName(event)
  const number = pullRequest?.number
  // TODO(slopradar): duplicate-logic: the title or #number or 'a pull request' fallback is pullRequestLabel below written a second time (added by the round 1 PR fix), use pullRequestLabel(payload) (visible wording change, owner call)
  const title =
    pullRequest?.title ??
    (number ? `pull request #${number}` : 'a pull request')
  const user = pullRequest?.user?.login
  const verb = pullRequestVerb(payload, merged)
  const description = user
    ? `${verb} ${user}'s ${title} on ${repoName}`
    : `${verb} ${title} on ${repoName}`

  return { description, icon: Icons.gitPullRequest }
}

const describeIssue = (event: GitHubEvent): EventDescription => {
  const payload = event.payload as IssuesPayload
  const action = payload.action ?? 'updated'
  const issueTitle = payload.issue?.title ?? 'an issue'
  let icon = Icons.issueOpened

  if (action === 'reopened' || action === 'edited') {
    icon = Icons.issueReopened
  } else if (action === 'closed') {
    icon = Icons.issueClosed
  } else if (action === 'assigned' || action === 'unassigned') {
    icon = Icons.issueTrackedBy
  } else if (action === 'labeled' || action === 'unlabeled') {
    icon = Icons.issueTracks
  }

  return {
    description: `${event.actor?.login ?? 'Someone'} ${action} ${issueTitle} on ${getRepoName(event)}`,
    icon,
  }
}

const describeIssueComment = (event: GitHubEvent): EventDescription => {
  const payload = event.payload as IssuesPayload
  const issueTitle = payload.issue?.title ?? 'an issue'
  const issueNumber = payload.issue?.number
  const issueLabel = issueNumber
    ? `${issueTitle} (#${issueNumber})`
    : issueTitle

  return { description: `Commented on ${issueLabel}`, icon: Icons.comment }
}

const describeCreate = (event: GitHubEvent): EventDescription => {
  const payload = event.payload as CreatePayload
  const refType = payload.ref_type ?? 'branch'
  let icon = Icons.gitBranch

  if (refType === 'repository') {
    icon = Icons.repo
  } else if (refType === 'tag') {
    icon = Icons.gitTag
  }

  return {
    description: `Created a ${refType} on ${getRepoName(event)}`,
    icon,
  }
}

const describeDelete = (event: GitHubEvent): EventDescription => {
  const payload = event.payload as CreatePayload
  const refType = payload.ref_type ?? 'branch'

  return {
    description: `Deleted a ${refType} on ${getRepoName(event)}`,
    icon: refType === 'branch' ? Icons.gitBranch : Icons.gitTag,
  }
}

// GitHub can leave the title out of the payload, so the noun lives here and
// the label never reads "pull request a pull request"
const pullRequestLabel = (payload: PullRequestPayload) => {
  const title = payload.pull_request?.title
  const number = payload.pull_request?.number
  if (title) {
    return number
      ? `pull request ${title} (#${number})`
      : `pull request ${title}`
  }
  return number ? `pull request #${number}` : 'a pull request'
}

const describeEvent = (
  event: GitHubEvent,
  commits: PushCommit[] | undefined,
  merged: boolean
): EventDescription | null => {
  switch (event.type) {
    case 'PushEvent':
      return describePush(event, commits)
    case 'PullRequestEvent':
      return describePullRequest(event, merged)
    case 'WatchEvent':
      return {
        description: `Starred ${getRepoName(event)}`,
        icon: Icons.star,
      }
    case 'ForkEvent':
      return {
        description: `Forked ${getRepoName(event)}`,
        icon: Icons.repoForked,
      }
    case 'PullRequestReviewEvent':
      return {
        description: `Reviewed ${pullRequestLabel(event.payload as PullRequestPayload)}`,
        icon: Icons.gitPullRequest,
      }
    case 'PullRequestReviewCommentEvent':
      return {
        description: `Commented on ${pullRequestLabel(event.payload as PullRequestPayload)}`,
        icon: Icons.gitPullRequest,
      }
    case 'PullRequestReviewThreadEvent':
      return {
        description: `Marked a pull request thread as ${event.payload?.action ?? 'resolved'} on ${getRepoName(event)}`,
        icon: Icons.gitPullRequest,
      }
    case 'PublicEvent':
      return {
        description: `Open-sourced ${getRepoName(event)} on GitHub`,
        icon: Icons.feedPublic,
      }
    case 'IssueCommentEvent':
      return describeIssueComment(event)
    case 'CreateEvent':
      return describeCreate(event)
    case 'DeleteEvent':
      return describeDelete(event)
    case 'IssuesEvent':
      return describeIssue(event)
    default:
      return null
  }
}

export const GitHubEventRow = ({
  event,
  commits,
  merged = false,
}: {
  event: GitHubEvent
  commits?: PushCommit[]
  merged?: boolean
}) => {
  const described = describeEvent(event, commits, merged)

  return described ? (
    <EventRow
      date={event.created_at}
      description={described.description}
      icon={described.icon}
    />
  ) : null
}
