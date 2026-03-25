import {
  SplitSection,
  SplitSectionContent,
  SplitSectionHeader,
  SplitSectionSidebar,
} from '@/components/sections/split-section'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
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
          <ProgressiveBlur height="50%" position="bottom" />
        </SplitSectionContent>
      </SplitSection>
    )
  } catch {
    return null
  }
}
