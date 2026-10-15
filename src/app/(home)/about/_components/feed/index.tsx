import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import Separator from '@/components/layout/sections/separator'
import { ViewAnimation } from '@/components/view-animation'
import { getActivityItems } from './data'
import { GitHubEvent as GitHubEventComponent, getEventUrl } from './event'

const MAX_ITEMS = 12

export default async function Feed(): Promise<React.ReactElement | null> {
  try {
    const items = await getActivityItems()

    if (items.length === 0) {
      return null
    }

    // Brings its own trailing separator so an empty feed leaves no double band
    return (
      <>
        <Section>
          <SectionHeader
            description='Recent activity from my GitHub.'
            title='Activity'
          />
          {/* The mask fades whole rows out instead of laying a gradient over text */}
          <ul className='mask-b-from-60% divide-y divide-line font-mono text-muted-foreground text-xs'>
            {items.slice(0, MAX_ITEMS).map((item, index) => (
              <ViewAnimation
                as='li'
                className='min-w-0'
                delay={0.03 * index}
                key={item.event.id}
              >
                <a
                  className='group block px-4 py-2 transition-colors hover:bg-card hover:text-foreground focus-visible:bg-card focus-visible:text-foreground'
                  data-sound-hover
                  href={getEventUrl(item.event, item.commits)}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <GitHubEventComponent
                    commits={item.commits}
                    event={item.event}
                  />
                </a>
              </ViewAnimation>
            ))}
          </ul>
        </Section>
        <Separator />
      </>
    )
  } catch {
    return null
  }
}
