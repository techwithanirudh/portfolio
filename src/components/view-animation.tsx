import type { CSSProperties, ReactNode } from 'react'

interface ViewAnimationProps {
  as?: 'div' | 'li'
  children: ReactNode
  className?: string
  delay?: number
}

const STAGGER_STEP = 0.05
const MAX_DELAY = 0.2

export const staggerDelay = (index: number, offset = 0) =>
  offset + STAGGER_STEP * index

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
        ? ({
            '--reveal-delay': `${Math.min(delay, MAX_DELAY)}s`,
          } as CSSProperties)
        : undefined
    }
  >
    {children}
  </Tag>
)
