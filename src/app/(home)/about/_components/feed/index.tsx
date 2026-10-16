import { Section } from '@/components/layout/sections'
import { ViewAnimation } from '@/components/view-animation'
import { getActivityItems } from './data'
import { GitHubEvent as GitHubEventComponent } from './event'

export default async function Feed(): Promise<React.ReactElement | null> {
  try {
    const items = await getActivityItems()

    if (items.length === 0) {
      return null
    }

    return (
      <Section>
        <ViewAnimation className='border-border border-b border-dashed bg-muted/40 px-6 py-2 font-mono text-muted-foreground text-xs'>
          <h3>Latest activity</h3>
        </ViewAnimation>
        {/* The list fades out at the bottom instead of ending on a hard row */}
        <div className='relative flex max-h-96 flex-col gap-2 overflow-hidden px-6 py-6 font-mono text-muted-foreground text-xs sm:text-sm'>
          {items.map((item, index) => (
            <ViewAnimation delay={0.03 * index} key={item.event.id}>
              <GitHubEventComponent commits={item.commits} event={item.event} />
            </ViewAnimation>
          ))}
          <div className='pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background' />
        </div>
      </Section>
    )
  } catch {
    return null
  }
}
