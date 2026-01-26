import { Children, isValidElement, type ReactNode } from 'react'
import { Balancer } from 'react-wrap-balancer'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps {
  title: string | ReactNode
  description?: string | ReactNode | null
  children?: ReactNode
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  align?: 'left' | 'center'
  sticky?: boolean
}

export const SectionHeader = ({
  title,
  description,
  children,
  className,
  titleClassName,
  descriptionClassName,
  align = 'center',
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
    <ViewAnimation
      initial={{ opacity: 0, translateY: -6 }}
      whileInView={{ opacity: 1, translateY: 0 }}
    >
      <h2
        className={cn(
          'font-normal text-3xl leading-tight tracking-tighter',
          'md:text-4xl',
          titleClassName
        )}
      >
        <Balancer>{title}</Balancer>
      </h2>
    </ViewAnimation>
    {description && (
      <ViewAnimation
        delay={0.1}
        initial={{ opacity: 0, translateY: -6 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <p
          className={cn(
            'text-base text-muted-foreground',
            descriptionClassName
          )}
        >
          <Balancer>{description}</Balancer>
        </p>
      </ViewAnimation>
    )}
    {Children.map(Children.toArray(children), (child, index) => {
      const key = isValidElement(child)
        ? (child.key ?? `section-header-child-${index}`)
        : `${String(child)}-${index}`

      return child ? (
        <ViewAnimation
          delay={0.1 + index * 0.05}
          initial={{ opacity: 0, translateY: -6 }}
          key={key}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          {child}
        </ViewAnimation>
      ) : null
    })}
  </div>
)
