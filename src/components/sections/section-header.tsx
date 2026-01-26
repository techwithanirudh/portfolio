import type { ReactNode } from 'react'
import { Balancer } from 'react-wrap-balancer'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string | ReactNode
  description?: string | ReactNode | null
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  align?: 'left' | 'center'
}

export const SectionHeader = ({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  align = 'center',
}: SectionHeaderProps) => (
  <div
    className={cn(
      'flex flex-col gap-4',
      align === 'center' ? 'items-center text-center' : 'items-start text-left',
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
            'text-muted-foreground text-base',
            descriptionClassName
          )}
        >
          <Balancer>{description}</Balancer>
        </p>
      </ViewAnimation>
    )}
  </div>
)
