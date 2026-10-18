import { Children, type ReactNode } from 'react'
import { ViewAnimation } from '@/components/view-animation'
import { staggerDelay } from '@/lib/stagger'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps {
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
  children?: ReactNode
  className?: string
  description?: ReactNode
  sticky?: boolean
  title: ReactNode
}

export const SectionHeader = ({
  title,
  description,
  children,
  className,
  align = 'center',
  as: Heading = 'h2',
  sticky = false,
}: SectionHeaderProps) => (
  <div
    className={cn(
      'flex flex-col gap-4',
      align === 'center' ? 'items-center text-center' : 'items-start text-left',
      sticky ? 'sm:sticky sm:top-16' : null,
      className
    )}
  >
    <ViewAnimation>
      <Heading
        className={cn(
          'typography-title text-balance font-normal text-3xl leading-tight tracking-tighter',
          'md:text-5xl'
        )}
      >
        {title}
      </Heading>
    </ViewAnimation>
    {description && (
      <ViewAnimation delay={0.1}>
        <p className='text-pretty text-base text-muted-foreground'>
          {description}
        </p>
      </ViewAnimation>
    )}
    {Children.map(Children.toArray(children), (child, index) =>
      child ? (
        <ViewAnimation delay={staggerDelay(index, 0.1)}>{child}</ViewAnimation>
      ) : null
    )}
  </div>
)
