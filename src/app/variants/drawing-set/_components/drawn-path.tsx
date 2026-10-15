'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
import { type ComponentProps, useRef } from 'react'

type DrawnPathProps = Omit<
  ComponentProps<typeof motion.path>,
  'animate' | 'initial' | 'transition'
> & {
  /** Seconds to wait after the path scrolls into view. */
  delay?: number
  duration?: number
}

/**
 * A path that draws itself once, the first time it scrolls into view
 * (`pathLength` drives `stroke-dashoffset`). Static under reduced motion.
 */
export function DrawnPath({
  delay = 0,
  duration = 0.4,
  ...props
}: DrawnPathProps) {
  const ref = useRef<SVGPathElement>(null)
  const inView = useInView(ref, { amount: 0.2, once: true })
  const reduce = useReducedMotion()

  return (
    <motion.path
      animate={reduce || inView ? { pathLength: 1 } : { pathLength: 0 }}
      initial={reduce ? false : { pathLength: 0 }}
      ref={ref}
      transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    />
  )
}
