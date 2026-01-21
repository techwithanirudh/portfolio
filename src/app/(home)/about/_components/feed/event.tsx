import type { RestEndpointMethodTypes } from '@octokit/rest'
import {
  CommentIcon,
  FeedPublicIcon,
  GitBranchIcon,
  GitCommitIcon,
  GitPullRequestIcon,
  IssueClosedIcon,
  IssueOpenedIcon,
  IssueReopenedIcon,
  IssueTrackedByIcon,
  IssueTracksIcon,
  RepoForkedIcon,
  RepoIcon,
  StarIcon,
  TagIcon,
} from '@primer/octicons-react'

export type GitHubEvent =
  RestEndpointMethodTypes['activity']['listPublicEventsForUser']['response']['data'][number]

export interface PushCommit {
  sha: string
  message: string
}

type EventType =
  | 'CommitCommentEvent'
  | 'CreateEvent'
  | 'DeleteEvent'
  | 'ForkEvent'
  | 'GollumEvent'
  | 'IssueCommentEvent'
  | 'IssuesEvent'
  | 'MemberEvent'
  | 'PublicEvent'
  | 'PullRequestEvent'
  | 'PullRequestReviewEvent'
  | 'PullRequestReviewCommentEvent'
  | 'PullRequestReviewThreadEvent'
  | 'PushEvent'
  | 'ReleaseEvent'
  | 'SponsorshipEvent'
  | 'WatchEvent'

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
  pull_request?: {
    title?: string
    number?: number
    user?: {
      login?: string
    }
  }
}

interface CreatePayload {
  ref_type?: 'branch' | 'repository' | 'tag'
  ref?: string | null
}

const EventDate = ({ date }: { date: string | null }) => {
  if (!date) {
    return <div className='shrink-0 text-muted-foreground'>Recently</div>
  }

  return (
    <div className='shrink-0 text-muted-foreground'>
      {new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}
    </div>
  )
}

const getRepoName = (event: GitHubEvent) => event.repo?.name ?? 'a repository'

const PushEvent = ({
  event,
  commits,
}: {
  event: GitHubEvent
  commits?: PushCommit[]
}) => {
  const repoName = getRepoName(event)
  const commitMessages = commits?.map((commit) => commit.message) ?? []
  const commitCount = commitMessages.length
  let description = `Pushed commits to ${repoName}`

  if (commitCount > 0) {
    const list = new Intl.ListFormat('en', {
      style: 'long',
      type: 'conjunction',
    }).format(commitMessages)

    const commitLabel = commitCount === 1 ? 'commit' : 'commits'
    description = `Pushed ${commitCount} ${commitLabel} to ${repoName}: ${list}`
  }

  return (
    <div className='flex items-center gap-4'>
      <GitCommitIcon className='h-4 w-4 shrink-0' />
      <div className='flex-1 truncate'>{description}</div>
      <EventDate date={event.created_at ?? null} />
    </div>
  )
}

const PullRequestEvent = ({ event }: { event: GitHubEvent }) => {
  const payload = event.payload as PullRequestPayload
  const pullRequest = payload.pull_request
  const repoName = getRepoName(event)
  const title = pullRequest?.title ?? 'a pull request'
  const user = pullRequest?.user?.login
  const description = user
    ? `Merged ${user}'s ${title} on ${repoName}`
    : `Merged ${title} on ${repoName}`

  return (
    <div className='flex items-center gap-4'>
      <GitPullRequestIcon className='h-4 w-4 shrink-0' />
      <div className='flex-1 truncate'>{description}</div>
      <EventDate date={event.created_at ?? null} />
    </div>
  )
}

const IssuesEvent = ({ event }: { event: GitHubEvent }) => {
  const payload = event.payload as IssuesPayload
  const action = payload.action ?? 'updated'
  const issueTitle = payload.issue?.title ?? 'an issue'
  let Icon = IssueOpenedIcon

  if (action === 'reopened' || action === 'edited') {
    Icon = IssueReopenedIcon
  } else if (action === 'closed') {
    Icon = IssueClosedIcon
  } else if (action === 'assigned' || action === 'unassigned') {
    Icon = IssueTrackedByIcon
  } else if (action === 'labeled' || action === 'unlabeled') {
    Icon = IssueTracksIcon
  }

  return (
    <div className='flex items-center gap-4'>
      <Icon className='h-4 w-4 shrink-0' />
      <div className='flex-1 truncate'>
        {event.actor?.login ?? 'Someone'} {action} {issueTitle} on{' '}
        {getRepoName(event)}
      </div>
      <EventDate date={event.created_at ?? null} />
    </div>
  )
}

const PublicEvent = ({ event }: { event: GitHubEvent }) => (
  <div className='flex items-center gap-4'>
    <FeedPublicIcon className='h-4 w-4 shrink-0' />
    <div className='flex-1 truncate'>
      Open-sourced {getRepoName(event)} on GitHub
    </div>
    <EventDate date={event.created_at ?? null} />
  </div>
)

const IssueCommentEvent = ({ event }: { event: GitHubEvent }) => {
  const payload = event.payload as IssuesPayload
  const issueTitle = payload.issue?.title ?? 'an issue'
  const issueNumber = payload.issue?.number
  const issueLabel = issueNumber
    ? `${issueTitle} (#${issueNumber})`
    : issueTitle

  return (
    <div className='flex items-center gap-4'>
      <CommentIcon className='h-4 w-4 shrink-0' />
      <div className='flex-1 truncate'>Commented on {issueLabel}</div>
      <EventDate date={event.created_at ?? null} />
    </div>
  )
}

const CreateEvent = ({ event }: { event: GitHubEvent }) => {
  const payload = event.payload as CreatePayload
  const refType = payload.ref_type ?? 'branch'
  let Icon = GitBranchIcon

  if (refType === 'repository') {
    Icon = RepoIcon
  } else if (refType === 'tag') {
    Icon = TagIcon
  }

  return (
    <div className='flex items-center gap-4'>
      <Icon className='h-4 w-4 shrink-0' />
      <div className='flex-1 truncate'>
        Created a {refType} on {getRepoName(event)}
      </div>
      <EventDate date={event.created_at ?? null} />
    </div>
  )
}

const DeleteEvent = ({ event }: { event: GitHubEvent }) => {
  const payload = event.payload as CreatePayload
  const refType = payload.ref_type ?? 'branch'
  const Icon = refType === 'branch' ? GitBranchIcon : TagIcon

  return (
    <div className='flex items-center gap-4'>
      <Icon className='h-4 w-4 shrink-0' />
      <div className='flex-1 truncate'>
        Deleted a {refType} on {getRepoName(event)}
      </div>
      <EventDate date={event.created_at ?? null} />
    </div>
  )
}

const WatchEvent = ({ event }: { event: GitHubEvent }) => (
  <div className='flex items-center gap-4'>
    <StarIcon className='h-4 w-4 shrink-0' />
    <div className='flex-1 truncate'>Starred {getRepoName(event)}</div>
    <EventDate date={event.created_at ?? null} />
  </div>
)

const ForkEvent = ({ event }: { event: GitHubEvent }) => (
  <div className='flex items-center gap-4'>
    <RepoForkedIcon className='h-4 w-4 shrink-0' />
    <div className='flex-1 truncate'>Forked {getRepoName(event)}</div>
    <EventDate date={event.created_at ?? null} />
  </div>
)

const PullRequestReviewEvent = ({ event }: { event: GitHubEvent }) => {
  const payload = event.payload as PullRequestPayload
  const pullRequest = payload.pull_request
  const title = pullRequest?.title ?? 'a pull request'
  const number = pullRequest?.number
  const label = number ? `${title} (#${number})` : title

  return (
    <div className='flex items-center gap-4'>
      <GitPullRequestIcon className='h-4 w-4 shrink-0' />
      <div className='flex-1 truncate'>Reviewed pull request {label}</div>
      <EventDate date={event.created_at ?? null} />
    </div>
  )
}

const PullRequestReviewCommentEvent = ({ event }: { event: GitHubEvent }) => {
  const payload = event.payload as PullRequestPayload
  const pullRequest = payload.pull_request
  const title = pullRequest?.title ?? 'a pull request'
  const number = pullRequest?.number
  const label = number ? `${title} (#${number})` : title

  return (
    <div className='flex items-center gap-4'>
      <GitPullRequestIcon className='h-4 w-4 shrink-0' />
      <div className='flex-1 truncate'>Commented on pull request {label}</div>
      <EventDate date={event.created_at ?? null} />
    </div>
  )
}

const PullRequestReviewThreadEvent = ({ event }: { event: GitHubEvent }) => (
  <div className='flex items-center gap-4'>
    <GitPullRequestIcon className='h-4 w-4 shrink-0' />
    <div className='flex-1 truncate'>
      Marked a pull request thread as {event.payload?.action ?? 'resolved'} on{' '}
      {getRepoName(event)}
    </div>
    <EventDate date={event.created_at ?? null} />
  </div>
)

export const GitHubEvent = ({
  event,
  commits,
}: {
  event: GitHubEvent
  commits?: PushCommit[]
}) => {
  if (!event.type) {
    return null
  }

  const type = event.type as EventType

  switch (type) {
    case 'PushEvent':
      return <PushEvent commits={commits} event={event} />
    case 'PullRequestEvent':
      return <PullRequestEvent event={event} />
    case 'WatchEvent':
      return <WatchEvent event={event} />
    case 'ForkEvent':
      return <ForkEvent event={event} />
    case 'PullRequestReviewEvent':
      return <PullRequestReviewEvent event={event} />
    case 'PullRequestReviewCommentEvent':
      return <PullRequestReviewCommentEvent event={event} />
    case 'PullRequestReviewThreadEvent':
      return <PullRequestReviewThreadEvent event={event} />
    case 'PublicEvent':
      return <PublicEvent event={event} />
    case 'IssueCommentEvent':
      return <IssueCommentEvent event={event} />
    case 'CreateEvent':
      return <CreateEvent event={event} />
    case 'DeleteEvent':
      return <DeleteEvent event={event} />
    case 'IssuesEvent':
      return <IssuesEvent event={event} />
    default:
      return null
  }
}
