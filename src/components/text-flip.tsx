'use client'

// Adapted from chanhdai.com (MIT, (c) Chanh Dai): https://github.com/ncdai/chanhdai.com
import type { Transition, Variants } from 'motion/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Children, type ReactNode, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const defaultVariants: Variants = {
  animate: { filter: 'blur(0px)', opacity: 1, y: '0%' },
  exit: {
    filter: 'blur(1px)',
    opacity: 0,
    transition: { ease: 'easeOut' },
    y: '40%',
  },
  initial: { filter: 'blur(1px)', opacity: 0, y: '-20%' },
}

interface TextFlipProps {
  children: ReactNode[]
  className?: string
  /** Seconds between flips. */
  interval?: number
  onIndexChange?: (index: number) => void
  play?: boolean
  transition?: Transition
  variants?: Variants
}

export function TextFlip({
  children,
  className,
  interval = 2,
  onIndexChange,
  play = true,
  transition = { duration: 0.3 },
  variants = defaultVariants,
}: TextFlipProps) {
  const [index, setIndex] = useState(0)
  const reducedMotion = useReducedMotion()
  const items = Children.toArray(children)

  useEffect(() => {
    if (!play || reducedMotion) {
      return
    }
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % items.length
        onIndexChange?.(next)
        return next
      })
    }, interval * 1000)
    return () => clearInterval(timer)
  }, [play, reducedMotion, interval, items.length, onIndexChange])

  return (
    <AnimatePresence initial={false} mode='wait'>
      <motion.p
        animate='animate'
        className={cn('inline-block', className)}
        exit='exit'
        initial='initial'
        key={index}
        transition={transition}
        variants={variants}
      >
        {items[index]}
      </motion.p>
    </AnimatePresence>
  )
}
