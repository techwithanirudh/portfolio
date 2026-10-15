'use client'

import { useInView } from 'motion/react'
import { type ReactNode, useRef } from 'react'

/**
 * A highlighter stroke that sweeps left to right the first time it scrolls
 * into view. The sweep itself is a CSS transition, so reduced motion simply
 * shows it already marked.
 */
export function Mark({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref, { amount: 1, once: true })
  return (
    <mark className='fn-mark' data-seen={seen} ref={ref}>
      {children}
    </mark>
  )
}
