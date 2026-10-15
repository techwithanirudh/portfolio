'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ViewAnimationProps {
  animate?: Record<string, string | number>
  /** Render as a list item so animated rows stay valid children of a list */
  as?: 'div' | 'li'
  blur?: boolean
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  initial?: Record<string, string | number>
  whileInView?: Record<string, string | number>
}

export const ViewAnimation = ({
  as = 'div',
  initial,
  whileInView,
  animate,
  delay,
  duration,
  blur = false,
  className,
  children,
}: ViewAnimationProps) => {
  const initialState = blur ? { filter: 'blur(4px)', ...initial } : initial
  const whileInViewState = blur
    ? { filter: 'blur(0px)', ...whileInView }
    : whileInView
  const normalizedDelay = delay ? Math.min(delay, 0.2) : delay
  const Component = as === 'li' ? motion.li : motion.div

  return (
    <Component
      animate={animate}
      className={cn(
        className,
        'motion-reduce:transform-none! motion-reduce:opacity-100! motion-reduce:[filter:none]!'
      )}
      initial={initialState}
      transition={{ delay: normalizedDelay, duration: duration ?? 0.3 }}
      viewport={{ amount: 0.1, once: true }}
      whileInView={whileInViewState}
    >
      {children}
    </Component>
  )
}
