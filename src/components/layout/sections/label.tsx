import type { ReactNode } from 'react'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

interface SectionLabelProps {
  action?: ReactNode
  children: string
  className?: string
  id?: string
}

// Terminal-path section heading, e.g. "~/experience", with a trailing action
export const SectionLabel = ({
  action,
  children,
  className,
  id,
}: SectionLabelProps) => (
  <ViewAnimation
    initial={{ opacity: 0, translateY: -6 }}
    whileInView={{ opacity: 1, translateY: 0 }}
  >
    <div className={cn('flex items-center gap-3 px-4 sm:px-6', className)}>
      <h2
        className='font-heading text-muted-foreground text-sm tracking-normal!'
        id={id}
      >
        <span className='text-primary'>~/</span>
        <span className='text-foreground'>{children}</span>
      </h2>
      <span
        aria-hidden
        className='flex-1 border-border border-t border-dashed'
      />
      {action}
    </div>
  </ViewAnimation>
)
