import type { ReactNode } from 'react'
import { Section } from '@/components/layout/sections'

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
  <Section className={className} fill sectionClassName={sectionClassName}>
    {children}
  </Section>
)
