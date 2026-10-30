import type { RestEndpointMethodTypes } from '@octokit/rest'

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
