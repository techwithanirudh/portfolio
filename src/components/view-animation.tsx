import type { CSSProperties, ReactNode } from 'react'

interface ViewAnimationProps {
  /** Render as a list item so animated rows stay valid children of a list */
  as?: 'div' | 'li'
  children: ReactNode
  className?: string
  /** Seconds to wait once in view, for staggering rows; capped at 0.2 */
  delay?: number
}

// Opts an element into the site wide entrance: it fades and rises in the
// first time it scrolls into view. The observer lives in reveal-script.ts and
// the motion in globals.css, so this renders on the server with no JS of its own.
export const ViewAnimation = ({
  as: Tag = 'div',
  delay,
  className,
  children,
}: ViewAnimationProps) => (
  <Tag
    className={className}
    data-reveal-item
    style={
      delay
        ? ({ '--reveal-delay': `${Math.min(delay, 0.2)}s` } as CSSProperties)
        : undefined
    }
  >
    {children}
  </Tag>
)
