import { Children, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps {
  /** Kept for older call sites, headers are always left aligned now. */
  align?: 'left' | 'center'
  children?: ReactNode
  className?: string
  description?: string | ReactNode | null
  descriptionClassName?: string
  sticky?: boolean
  title: string | ReactNode
  titleClassName?: string
}

export const SectionHeader = ({
  title,
  description,
  children,
  className,
  titleClassName,
  descriptionClassName,
  sticky = false,
}: SectionHeaderProps) => (
  <div
    className={cn(
      'flex flex-col items-start text-left',
      sticky && 'lg:sticky lg:top-16',
      className
    )}
  >
    <h2
      className={cn(
        'screen-line-bottom w-full px-4 py-2 font-heading font-medium text-2xl tracking-tight sm:text-3xl',
        titleClassName
      )}
    >
      {title}
    </h2>
    {description && (
      <p
        className={cn(
          'text-pretty px-4 pt-3 text-muted-foreground text-sm',
          descriptionClassName
        )}
      >
        {description}
      </p>
    )}
    {Children.toArray(children).length > 0 && (
      <div className='flex flex-wrap gap-2 px-4 pt-3'>{children}</div>
    )}
  </div>
)
