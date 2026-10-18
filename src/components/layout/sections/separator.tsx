import { Section } from '@/components/layout/sections'
import { cn } from '@/lib/utils'

interface SeparatorProps {
  className?: string
  variant?: 'dashed' | 'transparent'
}

// TODO(slopradar): unclear-name: collides with ui/separator and is the only default export in layout/sections, rename SectionDivider and use a named export (x5 callers)
const Separator = ({ className, variant = 'dashed' }: SeparatorProps) => (
  <Section sectionClassName='max-sm:hidden'>
    <div
      className={cn('h-8', variant === 'dashed' && 'bg-dashed', className)}
    />
  </Section>
)

export default Separator
