import { Section } from '@/components/layout/sections'
import { cn } from '@/lib/utils'

interface SectionDividerProps {
  className?: string
  variant?: 'dashed' | 'transparent'
}

export const SectionDivider = ({
  className,
  variant = 'dashed',
}: SectionDividerProps) => (
  <Section sectionClassName='max-sm:hidden'>
    <div
      className={cn('h-8', variant === 'dashed' && 'bg-dashed', className)}
    />
  </Section>
)
