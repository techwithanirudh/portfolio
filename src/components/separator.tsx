import { cn } from '@/lib/utils'
import { Section } from './section'

interface SeparatorProps {
  className?: string
  variant?: 'dashed' | 'transparent'
}

const Separator = ({ className, variant = 'dashed' }: SeparatorProps) => (
  <Section>
    <div
      className={cn(
        'h-8',
        variant === 'dashed' && 'bg-dashed',
        className
      )}
    />
  </Section>
)

export default Separator
