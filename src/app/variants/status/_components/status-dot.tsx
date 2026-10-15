import { cn } from '@/lib/utils'

interface StatusDotProps {
  className?: string
  pulse?: boolean
  /** Any CSS colour, usually a variant token like `var(--ok)`. */
  tone?: string
}

export function StatusDot({ className, pulse, tone }: StatusDotProps) {
  return (
    <span
      aria-hidden
      className={cn('vs-dot', className)}
      data-pulse={pulse ? 'true' : undefined}
      style={tone ? ({ '--dot': tone } as React.CSSProperties) : undefined}
    />
  )
}
