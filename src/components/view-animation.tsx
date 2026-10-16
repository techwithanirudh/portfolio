import type { CSSProperties, ReactNode } from 'react'

interface ViewAnimationProps {
  as?: 'div' | 'li'
  children: ReactNode
  className?: string
  delay?: number
}

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
