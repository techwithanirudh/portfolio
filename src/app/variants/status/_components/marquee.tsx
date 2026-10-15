// Adapted from nelsonlai.dev/src/components/ui/marquee.tsx (MIT, © 2025 Nelson Lai). See ../NOTICES.md
import { cn } from '@/lib/utils'

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  duration?: number
  fade?: boolean
  gap?: string
  pauseOnHover?: boolean
  reverse?: boolean
  trackClassName?: string
}

/**
 * CSS keyframe marquee. The content is rendered twice; the copy is
 * `aria-hidden`, and under reduced motion it is removed and the original
 * wraps (see `variant.css`).
 */
export function Marquee(props: MarqueeProps) {
  const {
    children,
    gap = '1rem',
    duration = 40,
    pauseOnHover = true,
    fade = true,
    reverse = false,
    className,
    trackClassName,
  } = props

  const mask = fade
    ? 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1.0) 8%, rgba(0, 0, 0, 1.0) 92%, transparent 100%)'
    : undefined

  return (
    <div
      className={cn('vs-marquee flex overflow-hidden', className)}
      data-pause-on-hover={pauseOnHover}
      data-reverse={reverse}
      data-slot='marquee'
      style={{
        gap,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      {[0, 1].map((copy) => (
        <div
          aria-hidden={copy === 1 ? true : undefined}
          className={cn(
            'vs-marquee-track flex shrink-0 justify-around',
            trackClassName
          )}
          key={copy}
          style={
            {
              '--marquee-duration': `${duration}s`,
              '--marquee-gap': gap,
              gap,
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      ))}
    </div>
  )
}
