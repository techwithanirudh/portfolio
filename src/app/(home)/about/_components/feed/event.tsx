import type { RestEndpointMethodTypes } from '@octokit/rest'
import { type Icon, Icons } from '@/components/icons/icons'

export type GitHubEvent =
  RestEndpointMethodTypes['activity']['listPublicEventsForUser']['response']['data'][number]

export interface PushCommit {
  message: string
  sha: string
}

const eventTypes = [
  'CreateEvent',
  'DeleteEvent',
  'ForkEvent',
  'IssueCommentEvent',
  'IssuesEvent',
  'PublicEvent',
  'PullRequestEvent',
  'PullRequestReviewEvent',
  'PullRequestReviewCommentEvent',
  'PullRequestReviewThreadEvent',
  'PushEvent',
  'WatchEvent',
] as const

type EventType = (typeof eventTypes)[number]

export const isSupportedEvent = (
  event: GitHubEvent
): event is GitHubEvent & { type: EventType } =>
  (eventTypes as readonly (string | null)[]).includes(event.type)

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
  ref?: string | null
  ref_type?: 'branch' | 'repository' | 'tag'
}

const EventDate = ({ date }: { date: string | null }) => {
  if (!date) {
    return <div className='shrink-0 text-muted-foreground'>Recently</div>
  }

  return (
    <div className='shrink-0 text-muted-foreground'>
      {new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}
    </div>
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
  icon: Icon
}) => (
  <div className='flex items-center gap-4'>
    <EventIcon className='icon-tilt-reverse size-4 shrink-0 text-muted-foreground' />
    <div className='min-w-0 flex-1 truncate' title={description}>
      {description}
    </div>
    <EventDate date={date ?? null} />
  </div>
)

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
    const list = commitListFormat.format(commitMessages)
    const commitLabel = commitCount === 1 ? 'commit' : 'commits'
    description = `Pushed ${commitCount} ${commitLabel} to ${repoName}: ${list}`
  }

  return (
    <EventRow
      date={event.created_at}
      description={description}
      icon={Icons.gitCommit}
    />
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
    <EventRow
      date={event.created_at}
      description={description}
      icon={Icons.gitPullRequest}
    />
  )
}

const IssuesEvent = ({ event }: { event: GitHubEvent }) => {
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

  return (
    <EventRow
      date={event.created_at}
      description={`${event.actor?.login ?? 'Someone'} ${action} ${issueTitle} on ${getRepoName(event)}`}
      icon={icon}
    />
  )
}

const PublicEvent = ({ event }: { event: GitHubEvent }) => (
  <EventRow
    date={event.created_at}
    description={`Open-sourced ${getRepoName(event)} on GitHub`}
    icon={Icons.feedPublic}
  />
)

const IssueCommentEvent = ({ event }: { event: GitHubEvent }) => {
  const payload = event.payload as IssuesPayload
  const issueTitle = payload.issue?.title ?? 'an issue'
  const issueNumber = payload.issue?.number
  const issueLabel = issueNumber
    ? `${issueTitle} (#${issueNumber})`
    : issueTitle

  return (
    <EventRow
      date={event.created_at}
      description={`Commented on ${issueLabel}`}
      icon={Icons.comment}
    />
  )
}

const CreateEvent = ({ event }: { event: GitHubEvent }) => {
  const payload = event.payload as CreatePayload
  const refType = payload.ref_type ?? 'branch'
  let icon = Icons.gitBranch

  if (refType === 'repository') {
    icon = Icons.repo
  } else if (refType === 'tag') {
    icon = Icons.gitTag
  }

  return (
    <EventRow
      date={event.created_at}
      description={`Created a ${refType} on ${getRepoName(event)}`}
      icon={icon}
    />
  )
}

const DeleteEvent = ({ event }: { event: GitHubEvent }) => {
  const payload = event.payload as CreatePayload
  const refType = payload.ref_type ?? 'branch'

  return (
    <EventRow
      date={event.created_at}
      description={`Deleted a ${refType} on ${getRepoName(event)}`}
      icon={refType === 'branch' ? Icons.gitBranch : Icons.gitTag}
    />
  )
}

const WatchEvent = ({ event }: { event: GitHubEvent }) => (
  <EventRow
    date={event.created_at}
    description={`Starred ${getRepoName(event)}`}
    icon={Icons.star}
  />
)

const ForkEvent = ({ event }: { event: GitHubEvent }) => (
  <EventRow
    date={event.created_at}
    description={`Forked ${getRepoName(event)}`}
    icon={Icons.repoForked}
  />
)

const pullRequestLabel = (payload: PullRequestPayload) => {
  const title = payload.pull_request?.title ?? 'a pull request'
  const number = payload.pull_request?.number
  return number ? `${title} (#${number})` : title
}

const PullRequestReviewEvent = ({ event }: { event: GitHubEvent }) => (
  <EventRow
    date={event.created_at}
    description={`Reviewed pull request ${pullRequestLabel(event.payload as PullRequestPayload)}`}
    icon={Icons.gitPullRequest}
  />
)

const PullRequestReviewCommentEvent = ({ event }: { event: GitHubEvent }) => (
  <EventRow
    date={event.created_at}
    description={`Commented on pull request ${pullRequestLabel(event.payload as PullRequestPayload)}`}
    icon={Icons.gitPullRequest}
  />
)

const PullRequestReviewThreadEvent = ({ event }: { event: GitHubEvent }) => (
  <EventRow
    date={event.created_at}
    description={`Marked a pull request thread as ${event.payload?.action ?? 'resolved'} on ${getRepoName(event)}`}
    icon={Icons.gitPullRequest}
  />
)

export const GitHubEvent = ({
  event,
  commits,
}: {
  event: GitHubEvent
  commits?: PushCommit[]
}) => {
  if (!isSupportedEvent(event)) {
    return null
  }

  switch (event.type) {
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
