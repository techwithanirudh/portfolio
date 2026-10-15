import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { ViewAnimation } from '@/components/view-animation'
import { getActivityItems } from './actions'
import { GitHubEvent as GitHubEventComponent } from './event'

const MAX_ITEMS = 12

export default async function Feed(): Promise<React.ReactElement | null> {
  try {
    const items = await getActivityItems()

    if (items.length === 0) {
      return null
    }

    return (
      <Section>
        <SectionHeader
          description='Recent activity from my GitHub.'
          title='Activity'
        />
        {/* The mask fades whole rows out instead of laying a gradient over text */}
        <ul className='mask-b-from-60% divide-y divide-dashed divide-line font-mono text-muted-foreground text-xs'>
          {items.slice(0, MAX_ITEMS).map((item, index) => (
            <ViewAnimation
              delay={0.03 * index}
              initial={{ opacity: 0, translateY: -4 }}
              key={item.event.id}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <li className='min-w-0 px-4 py-2 transition-colors hover:bg-card hover:text-foreground'>
                <GitHubEventComponent
                  commits={item.commits}
                  event={item.event}
                />
              </li>
            </ViewAnimation>
          ))}
        </ul>
      </Section>
    )
  } catch {
    return null
  }
}
