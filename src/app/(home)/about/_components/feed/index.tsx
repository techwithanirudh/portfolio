import { unstable_cache } from 'next/cache'
import { Section } from '@/components/section'
import { SectionHeader } from '@/components/sections/section-header'
import { ViewAnimation } from '@/components/view-animation'
import { activity, owner } from '@/constants/config'
import { octokit } from '@/lib/github'
import { cn } from '@/lib/utils'
import {
  type GitHubEvent,
  GitHubEvent as GitHubEventComponent,
  type PushCommit,
} from './event'

const { limit } = activity

interface PushEventPayload {
  before?: string
  head?: string
}

interface ActivityEventItem {
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

export default async function Feed(): Promise<React.ReactElement | null> {
  try {
    const items = await getCachedActivityItems()

    if (items.length === 0) {
      return null
    }

    return (
      <Section>
        <div className='grid divide-y divide-dashed divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
          <div className='p-6 sm:sticky sm:top-16 sm:p-8'>
            <SectionHeader
              align='left'
              description='Fresh events from across my GitHub.'
              title='Live Activity'
            />
          </div>
          <div className='min-w-0 sm:col-span-2'>
            <div
              className={cn(
                'relative flex max-w-full flex-col gap-2 overflow-x-auto px-4 py-8 font-mono text-muted-foreground text-xs',
                'sm:overflow-visible sm:px-8 sm:text-sm'
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
              <div className='absolute right-0 bottom-6 left-0 z-10 h-40 bg-gradient-to-b from-transparent to-background' />
            </div>
          </div>
        </div>
      </Section>
    )
  } catch {
    return null
  }
}
