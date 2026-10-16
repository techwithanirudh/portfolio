import { Children, isValidElement, type ReactNode } from 'react'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps {
  align?: 'left' | 'center'
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
  title,
  description,
  children,
  className,
  titleClassName,
  descriptionClassName,
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
          'typography-title text-balance font-regular text-3xl leading-tight tracking-tighter',
          'md:text-5xl',
          titleClassName
        )}
      >
        {title}
      </Heading>
    </ViewAnimation>
    {description && (
      <ViewAnimation delay={0.1}>
        <p
          className={cn(
            'text-pretty text-base text-muted-foreground',
            descriptionClassName
          )}
        >
          {description}
        </p>
      </ViewAnimation>
    )}
    {Children.map(Children.toArray(children), (child, index) => {
      const key = isValidElement(child)
        ? (child.key ?? `section-header-child-${index}`)
        : `${String(child)}-${index}`

      return child ? (
        <ViewAnimation delay={0.1 + index * 0.05} key={key}>
          {child}
        </ViewAnimation>
      ) : null
    })}
  </div>
)
