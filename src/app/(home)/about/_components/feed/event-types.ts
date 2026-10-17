import type { GitHubEvent } from './event'

// The GitHub events the feed knows how to draw
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
