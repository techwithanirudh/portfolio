import type { ReactNode } from 'react'
import { Section } from '@/components/section'
import { cn } from '@/lib/utils'

interface SectionBodyProps {
  children: ReactNode
  className?: string
  sectionClassName?: string
}

export const SectionBody = ({
  children,
  className,
  sectionClassName,
}: SectionBodyProps) => (
  <Section
    className={cn('h-full', className)}
    sectionClassName={cn('flex flex-1', sectionClassName)}
  >
    {children}
  </Section>
)
