'use client'

import * as m from 'motion/react-m'
import type { ReactNode } from 'react'

interface ViewAnimationProps {
  as?: 'div' | 'li'
  children: ReactNode
  className?: string
  delay?: number
}

export const ViewAnimation = ({
  as = 'div',
  delay = 0,
  className,
  children,
}: ViewAnimationProps) => {
  const Tag = as === 'li' ? m.li : m.div
  return (
    <Tag
      className={className}
      data-reveal-item
      initial={{ opacity: 0, y: 6 }}
      transition={{
        delay: Math.min(delay, 0.2),
        duration: 0.45,
        ease: [0.2, 0.7, 0.2, 1],
      }}
      viewport={{ amount: 0.1, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </Tag>
  )
}
