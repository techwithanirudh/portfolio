import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type SectionProps = {
  sectionClassName?: string
} & HTMLAttributes<HTMLDivElement>

// One column panel with side rules and lines that run the full screen width,
// after chanhdai.com's Panel (MIT, (c) Chanh Dai)
export const Section = ({
  children,
  sectionClassName,
  className,
  ...props
}: SectionProps) => (
  <section className={sectionClassName} {...props}>
    <div className='container relative mx-auto'>
      <div
        className={cn(
          'screen-line-top screen-line-bottom border-line border-x',
          className
        )}
      >
        {children}
      </div>
    </div>
  </section>
)
