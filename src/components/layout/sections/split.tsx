import type { ReactNode } from 'react'
import { Section } from '@/components/layout/sections'
import {
  SectionHeader,
  type SectionHeaderProps,
} from '@/components/layout/sections/header'
import { cn } from '@/lib/utils'

// The column is too narrow for side by side, so the sidebar stacks on top
interface SplitSectionProps {
  children: ReactNode
  className?: string
  id?: string
}

export const SplitSection = ({
  children,
  className,
  id,
}: SplitSectionProps) => (
  <Section id={id}>
    <div className={cn('grid', className)}>{children}</div>
  </Section>
)

interface SplitSectionPartProps {
  children: ReactNode
  className?: string
}

export const SplitSectionSidebar = ({
  children,
  className,
}: SplitSectionPartProps) => (
  <div className={cn('flex flex-col', className)}>{children}</div>
)

export const SplitSectionHeader = (props: SectionHeaderProps) => (
  <SectionHeader {...props} />
)

export const SplitSectionContent = ({
  children,
  className,
}: SplitSectionPartProps) => <div className={className}>{children}</div>
