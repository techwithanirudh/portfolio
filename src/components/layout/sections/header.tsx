import { Children, type ReactNode } from 'react'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

// Only the text animates in, the rules stay put so the grid never shifts
const rise = {
  initial: { opacity: 0, translateY: -6 },
  whileInView: { opacity: 1, translateY: 0 },
}

export interface SectionHeaderProps {
  /** Sits on the right of the title row, for a single compact control */
  action?: ReactNode
  /** Kept for older call sites, headers are always left aligned now. */
  align?: 'left' | 'center'
  /** Heading level; page-level headers (contact, guestbook) use h1 */
  as?: 'h1' | 'h2'
  children?: ReactNode
  className?: string
  description?: string | ReactNode | null
  descriptionClassName?: string
  sticky?: boolean
  title: string | ReactNode
  titleClassName?: string
}

export const SectionHeader = ({
  action,
  as: Heading = 'h2',
  title,
  description,
  children,
  className,
  titleClassName,
  descriptionClassName,
  sticky = false,
}: SectionHeaderProps) => {
  const hasChildren = Children.toArray(children).length > 0
  return (
    <div
      className={cn(
        'flex flex-col items-start text-left',
        // The intro block gets its own rule so the content below never runs into it
        (description || hasChildren) && 'screen-line-bottom pb-3',
        sticky && 'lg:sticky lg:top-16',
        className
      )}
    >
      <div className='screen-line-bottom flex w-full items-stretch justify-between gap-4'>
        <ViewAnimation {...rise}>
          <Heading
            className={cn(
              'px-4 py-2 font-heading font-medium text-2xl tracking-tight sm:text-3xl',
              titleClassName
            )}
          >
            {title}
          </Heading>
        </ViewAnimation>
        {action && <div className='flex shrink-0'>{action}</div>}
      </div>
      {description && (
        <ViewAnimation {...rise} className='w-full' delay={0.05}>
          <p
            className={cn(
              'text-pretty px-4 pt-3 text-muted-foreground text-sm',
              descriptionClassName
            )}
          >
            {description}
          </p>
        </ViewAnimation>
      )}
      {hasChildren && (
        <ViewAnimation
          {...rise}
          className='flex flex-wrap gap-2 px-4 pt-3'
          delay={0.1}
        >
          {children}
        </ViewAnimation>
      )}
    </div>
  )
}
