import {
  colophonAttributions,
  colophonSections,
} from '@/constants/portfolio/colophon'
import { cn } from '@/lib/utils'
import {
  colophonCardBorderClasses,
  colophonGridClassName,
} from './colophon-grid'
import { ColophonSection } from './colophon-section'

export const Attribution = () => (
  <ColophonSection
    className={colophonGridClassName}
    title={colophonSections.attribution.title}
  >
    <div className='flex h-full flex-col gap-2 border-border border-b border-dashed bg-card/50 p-6 text-muted-foreground text-sm sm:col-span-2 lg:col-span-3'>
      Borrowed code and design cues from these thoughtful creators.
    </div>
    {colophonAttributions.map((creator, index) => (
      <a
        className={cn(
          'flex items-center gap-2 bg-card/50 p-6 text-muted-foreground text-sm transition-colors hover:bg-card/80 hover:text-foreground',
          colophonCardBorderClasses(index)
        )}
        href={creator.url}
        key={creator.name}
        rel='noopener noreferrer'
        target='_blank'
      >
        <span className='size-2 rotate-45 border border-border bg-accent' />
        <span className='underline decoration-border underline-offset-4'>
          {creator.name}
        </span>
      </a>
    ))}
  </ColophonSection>
)
