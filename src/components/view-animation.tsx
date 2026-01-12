'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface ViewAnimationProps {
  initial?: Record<string, string | number>
  whileInView?: Record<string, string | number>
  animate?: Record<string, string | number>
  delay?: number
  // className?: ComponentProps<typeof motion.div>['className'];
  className?: string
  children: ReactNode
}

export const ViewAnimation = ({
  initial,
  whileInView,
  animate,
  delay,
  className,
  children,
}: ViewAnimationProps) => {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return children
  }

  return (
    <motion.div
      animate={animate}
      className={className}
      initial={{ filter: 'blur(4px)', ...initial }}
      transition={{ delay, duration: 0.8 }}
      viewport={{ once: true, amount: 0.5 }}
      whileInView={{ filter: 'blur(0px)', ...whileInView }}
    >
      {children}
    </motion.div>
  )
}
