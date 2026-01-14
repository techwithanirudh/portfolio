import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import { octokit } from '@/lib/github'
import { cn } from '@/lib/utils'
import { GitHubEvent } from './github-event'

export default async function Feed(): Promise<React.ReactElement | null> {
  try {
    const activity = await octokit.rest.activity.listPublicEventsForUser({
      username: 'techwithanirudh',
      per_page: 15,
    })

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
                <h2 className='font-semibold text-2xl'>Recently Touched</h2>
                <p className='text-muted-foreground text-sm'>
                  My latest GitHub activity and contributions.
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
              {activity.data.slice(0, 10).map((event, index) => (
                <ViewAnimation
                  delay={index * 0.1}
                  initial={{ opacity: 0, translateY: -8 }}
                  key={event.id}
                  whileInView={{ opacity: 1, translateY: 0 }}
                >
                  <GitHubEvent event={event} />
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
