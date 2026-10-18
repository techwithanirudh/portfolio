import type { ReactNode } from 'react'
import { Section } from '@/components/layout/sections'

interface SectionBodyProps {
  children: ReactNode
  className?: string
  sectionClassName?: string
}

// TODO(slopradar): pass-through-wrapper: SectionBody is <Section fill> under another name, use <Section fill> at its call sites and delete the file
export const SectionBody = ({
  children,
  className,
  sectionClassName,
}: SectionBodyProps) => (
  <Section className={className} fill sectionClassName={sectionClassName}>
    {children}
  </Section>
)
