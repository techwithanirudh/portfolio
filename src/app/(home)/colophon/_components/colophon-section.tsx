import type { ReactNode } from 'react'
import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

interface ColophonSectionProps {
  title: string
  children: ReactNode
  className?: string
  headingClassName?: string
  delay?: number
}

export const ColophonSection = ({
  title,
  children,
  className,
  headingClassName,
  delay = 0,
}: ColophonSectionProps) => (
  <>
    <Section className='p-6'>
      <ViewAnimation
        delay={delay}
        initial={{ opacity: 0, translateY: 6 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <h2 className={cn('font-medium text-xl', headingClassName)}>{title}</h2>
      </ViewAnimation>
    </Section>
    <Section>
      <ViewAnimation
        delay={delay ? delay + 0.05 : 0.05}
        initial={{ opacity: 0, translateY: 6 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <div className={className}>{children}</div>
      </ViewAnimation>
    </Section>
  </>
)
