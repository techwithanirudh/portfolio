import { PreviewLink } from '@/components/preview-link'
import {
  attributionIntro,
  attributions,
  designInspiration,
} from '@/constants/portfolio/colophon'
import { cn } from '@/lib/utils'
import {
  colophonCardBorderClasses,
  colophonGridClassName,
} from './colophon-grid'

export const Attribution = () => (
  <div className={colophonGridClassName}>
    <div className='flex h-full flex-col gap-2 border-border border-b border-dashed bg-card/50 p-6 text-muted-foreground text-sm sm:col-span-2 lg:col-span-3'>
      <p>{attributionIntro}</p>
      <p>
        Some design ideas also come from{' '}
        <PreviewLink className='link-underline' href={designInspiration.url}>
          {designInspiration.name}
        </PreviewLink>
        .
      </p>
    </div>
    {attributions.map((creator, index) => (
      <PreviewLink
        className={cn(
          'flex items-center gap-2 bg-card/50 p-6 text-muted-foreground text-sm transition-colors hover:bg-card/80 hover:text-foreground',
          colophonCardBorderClasses(index)
        )}
        href={creator.url}
        key={creator.name}
      >
        <span className='size-2 rotate-45 border border-border bg-accent' />
        <span className='underline decoration-border underline-offset-4'>
          {creator.name}
        </span>
      </PreviewLink>
    ))}
  </div>
)
