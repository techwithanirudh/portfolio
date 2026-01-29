import {
  SplitSection,
  SplitSectionContent,
  SplitSectionHeader,
  SplitSectionSidebar,
} from '@/components/sections/split-section'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'
import { getActivityItems } from './actions'
import { GitHubEvent as GitHubEventComponent } from './event'

export default async function Feed(): Promise<React.ReactElement | null> {
  try {
    const items = await getActivityItems()

    if (items.length === 0) {
      return null
    }

    return (
      <SplitSection cols='three'>
        <SplitSectionSidebar background='dashed'>
          <SplitSectionHeader
            description='Fresh events from across my GitHub.'
            sticky
            title='Live Activity'
          />
        </SplitSectionSidebar>
        <SplitSectionContent
          className={cn(
            'sm:col-span-2',
            'relative flex max-w-full flex-col gap-2 overflow-x-auto font-mono text-muted-foreground text-xs',
            'sm:overflow-visible sm:text-sm',
            'sm:px-8'
          )}
          inset
        >
          {items.map((item, index) => (
            <ViewAnimation
              delay={0.05 * index}
              initial={{ opacity: 0, translateY: -8 }}
              key={item.event.id}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <GitHubEventComponent commits={item.commits} event={item.event} />
            </ViewAnimation>
          ))}
          <div className='absolute right-0 bottom-6 left-0 z-10 h-40 bg-gradient-to-b from-transparent to-background' />
        </SplitSectionContent>
      </SplitSection>
    )
  } catch {
    return null
  }
}
