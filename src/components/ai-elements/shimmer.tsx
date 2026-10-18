'use client'

import { type CSSProperties, type ElementType, memo } from 'react'
import { cn } from '@/lib/utils'

// TODO(slopradar): unused-export: TextShimmerProps has no importer, un-export it
export interface TextShimmerProps {
  as?: ElementType
  children: string
  className?: string
  duration?: number
  spread?: number
}

const ShimmerComponent = ({
  children,
  as: Component = 'p',
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) => (
  <Component
    className={cn(
      // TODO(slopradar): dead-class: motion-reduce:animate-none is a no-op, the global reduced-motion rule (animation-duration 0.01ms !important, one iteration) already beats the inline animationDuration and leaves the base background-position, delete it
      'relative inline-block animate-shimmer bg-[length:250%_100%,auto] bg-clip-text text-transparent [background-position:100%_center] motion-reduce:animate-none',
      '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-background),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
      className
    )}
    style={
      {
        '--spread': `${children.length * spread}px`,
        animationDuration: `${duration}s`,
        backgroundImage:
          'var(--bg), linear-gradient(var(--color-muted-foreground), var(--color-muted-foreground))',
      } as CSSProperties
    }
  >
    {children}
  </Component>
)

export const Shimmer = memo(ShimmerComponent)
