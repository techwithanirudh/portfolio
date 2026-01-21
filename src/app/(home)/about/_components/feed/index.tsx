import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import { owner } from '@/constants/github'
import { octokit } from '@/lib/github'
import { cn } from '@/lib/utils'
import {
  type GitHubEvent,
  GitHubEvent as GitHubEventComponent,
  type PushCommit,
} from './event'

const activityLimit = 10
const fetchLimit = 25
const maxCommitsPerPush = 3

interface PushEventPayload {
  before?: string
  head?: string
}

interface ActivityEventItem {
  event: GitHubEvent
  commits?: PushCommit[]
}

const getRepoFromEvent = (event: GitHubEvent) => {
  if (!event.repo?.name) {
    return null
  }

  const [repoOwner, repoName] = event.repo.name.split('/')
  if (!(repoOwner && repoName)) {
    return null
  }

  return { owner: repoOwner, repo: repoName, fullName: event.repo.name }
}

const getPushEventCommits = async (
  event: GitHubEvent
): Promise<PushCommit[]> => {
  const payload = event.payload as PushEventPayload
  const repo = getRepoFromEvent(event)

  if (!(repo && payload.before && payload.head)) {
    return []
  }

  try {
    const comparison = await octokit.rest.repos.compareCommits({
      owner: repo.owner,
      repo: repo.repo,
      base: payload.before,
      head: payload.head,
    })

    return comparison.data.commits
      .slice(0, maxCommitsPerPush)
      .map((commit) => ({
        sha: commit.sha,
        message: commit.commit.message.split('\n')[0] ?? commit.commit.message,
      }))
  } catch {
    return []
  }
}

const buildActivityItems = async (events: GitHubEvent[]) => {
  const items: ActivityEventItem[] = []

  for (const event of events) {
    if (items.length >= activityLimit) {
      break
    }

    if (event.type === 'PushEvent') {
      const commits = await getPushEventCommits(event)
      items.push({ event, commits })
      continue
    }

    items.push({ event })
  }

  return items
}

export default async function Feed(): Promise<React.ReactElement | null> {
  try {
    const activity = await octokit.rest.activity.listPublicEventsForUser({
      username: owner,
      per_page: fetchLimit,
    })
    const items = await buildActivityItems(activity.data)

    if (items.length === 0) {
      return null
    }

    return (
      <Section>
        <div className='grid divide-y divide-dashed divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
          <div className='bg-dashed'>
            <ViewAnimation
              blur={false}
              className='h-full'
              duration={0.3}
              initial={{ opacity: 0, translateY: -6 }}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <div className='flex flex-col gap-1.5 p-8 sm:sticky sm:top-16'>
                <h2 className='font-semibold text-2xl'>Live Activity</h2>
                <p className='text-muted-foreground text-sm'>
                  Fresh events from across my GitHub.
                </p>
              </div>
            </ViewAnimation>
          </div>
          <div className='sm:col-span-2'>
            <div
              className={cn(
                'relative flex flex-col gap-2 px-4 py-8 font-mono text-muted-foreground text-xs',
                'sm:px-8 sm:text-sm'
              )}
            >
              {items.map((item, index) => (
                <ViewAnimation
                  delay={0.05 * index}
                  initial={{ opacity: 0, translateY: -8 }}
                  key={item.event.id}
                  whileInView={{ opacity: 1, translateY: 0 }}
                >
                  <GitHubEventComponent
                    commits={item.commits}
                    event={item.event}
                  />
                </ViewAnimation>
              ))}
              <div className='absolute right-0 bottom-6 left-0 z-10 h-40 bg-gradient-to-b from-transparent to-backdrop' />
            </div>
          </div>
        </div>
      </Section>
    )
  } catch {
    return null
  }
}
