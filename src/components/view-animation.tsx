'use client'

import { motion, useReducedMotion } from 'motion/react'
import { type ReactNode, useEffect, useState } from 'react'

interface ViewAnimationProps {
  animate?: Record<string, string | number>
  blur?: boolean
  children: ReactNode
  // className?: ComponentProps<typeof motion.div>['className'];
  className?: string
  delay?: number
  duration?: number
  initial?: Record<string, string | number>
  whileInView?: Record<string, string | number>
}

export const ViewAnimation = ({
  initial,
  whileInView,
  animate,
  delay,
  duration,
  blur = false,
  className,
  children,
}: ViewAnimationProps) => {
  const prefersReducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only act on the real motion preference after mount: `useReducedMotion`
  // reads matchMedia synchronously on first render, so branching on it
  // immediately can make the client's first render disagree with the
  // server-rendered HTML (which always assumes motion is allowed) and
  // trigger an un-recoverable hydration mismatch.
  const shouldReduceMotion = mounted && prefersReducedMotion

  const initialState = blur ? { filter: 'blur(4px)', ...initial } : initial
  const whileInViewState = blur
    ? { filter: 'blur(0px)', ...whileInView }
    : whileInView
  const normalizedDelay = delay ? Math.min(delay, 0.2) : delay

  return (
    <motion.div
      animate={
        shouldReduceMotion ? (animate ?? whileInViewState ?? {}) : animate
      }
      className={className}
      initial={shouldReduceMotion ? false : initialState}
      transition={{
        delay: shouldReduceMotion ? 0 : normalizedDelay,
        duration: shouldReduceMotion ? 0 : (duration ?? 0.3),
      }}
      viewport={{ amount: 0.1, once: true }}
      whileInView={shouldReduceMotion ? undefined : whileInViewState}
    >
      {children}
    </motion.div>
  )
}
