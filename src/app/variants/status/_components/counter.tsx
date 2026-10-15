// Adapted from nelsonlai.dev/src/components/counter.tsx (MIT, © 2025 Nelson Lai). See ../NOTICES.md
'use client'

import {
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'
import { useEffect, useRef } from 'react'

type CounterProps = React.ComponentProps<'span'> & {
  value: number
  direction?: 'up' | 'down'
}

/**
 * Counts up once when scrolled into view. The server renders the final
 * value, so the number is right without JavaScript and under reduced motion.
 */
export function Counter(props: CounterProps) {
  const { value, direction = 'up', ...rest } = props
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const motionValue = useMotionValue(direction === 'down' ? value : 0)
  const springValue = useSpring(motionValue, {
    damping: 100,
    stiffness: 300,
  })
  const isInView = useInView(ref, { margin: '-100px', once: true })

  // Reset to the start value only at the moment the count-up begins, so a
  // counter that never scrolls into view still shows the right number.
  useEffect(() => {
    if (!isInView || reduce) {
      return
    }
    if (ref.current) {
      ref.current.textContent = direction === 'down' ? String(value) : '0'
    }
    motionValue.set(direction === 'down' ? 0 : value)
  }, [motionValue, isInView, direction, value, reduce])

  useEffect(() => {
    if (reduce) {
      return
    }
    return springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toFixed(0)
      }
    })
  }, [springValue, reduce])

  return (
    <span ref={ref} {...rest}>
      {value}
    </span>
  )
}
