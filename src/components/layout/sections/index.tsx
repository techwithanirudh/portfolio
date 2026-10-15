import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type SectionProps = {
  /**
   * Stretch to the leftover viewport height (and stand in for the layout's
   * PageFill), so a scrolling list can fill the screen above the footer
   */
  fill?: boolean
  sectionClassName?: string
} & HTMLAttributes<HTMLDivElement>

// One column panel with side rules and lines that run the full screen width,
// after chanhdai.com's Panel (MIT, (c) Chanh Dai)
export const Section = ({
  children,
  fill = false,
  sectionClassName,
  className,
  ...props
}: SectionProps) => (
  <section
    className={cn(
      fill && 'flex min-h-[28rem] flex-1 basis-0 flex-col',
      sectionClassName
    )}
    data-page-fill={fill ? 'page' : undefined}
    data-slot='section'
    {...props}
  >
    <div
      className={cn(
        'container relative mx-auto',
        fill && 'flex min-h-0 flex-1 flex-col'
      )}
    >
      <div
        className={cn(
          'screen-line-top screen-line-bottom border-line border-x',
          fill && 'flex min-h-0 flex-1 flex-col',
          className
        )}
        data-slot='section-inner'
      >
        {children}
      </div>
    </div>
  </section>
)
