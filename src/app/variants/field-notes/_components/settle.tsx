'use client'

import { motion, useInView } from 'motion/react'
import { type ReactNode, useRef } from 'react'

/**
 * Paper settling onto the desk: a 2° turn and an 8px drop the first time it
 * scrolls into view. With `drag`, it can be nudged and springs back.
 * Under reduced motion only the fade remains (MotionConfig in the layout).
 */
export function Settle({
  children,
  className,
  delay = 0,
  drag = false,
}: {
  children: ReactNode
  className?: string
  delay?: number
  drag?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { margin: '0px 0px -8% 0px', once: true })
  return (
    <motion.div
      animate={seen ? { opacity: 1, rotate: 0, y: 0 } : undefined}
      className={className}
      drag={drag}
      dragElastic={0.5}
      dragSnapToOrigin
      initial={{ opacity: 0, rotate: 2, y: 8 }}
      ref={ref}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileDrag={drag ? { cursor: 'grabbing', scale: 1.04, zIndex: 20 } : {}}
    >
      {children}
    </motion.div>
  )
}
