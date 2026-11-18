'use client'

// Icon Swap by Chánh Đại (MIT): https://chanhdai.com/components/icon-swap
// https://github.com/ncdai/chanhdai.com/blob/main/src/registry/components/icon-swap/icon-swap.tsx
import type { AnimatePresenceProps, HTMLMotionProps } from 'motion/react'
import { AnimatePresence, m } from 'motion/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function IconSwap(props: React.PropsWithChildren<AnimatePresenceProps>) {
  return <AnimatePresence initial={false} mode='popLayout' {...props} />
}

const shown = { filter: 'blur(0px)', opacity: 1, scale: 1 }
const hidden = { filter: 'blur(4px)', opacity: 0, scale: 0.25 }

export function IconSwapItem(props: HTMLMotionProps<'span'>) {
  // MotionConfig only drops the scale, so reduced motion gets a plain fade
  const reducedMotion = useReducedMotion()

  return (
    <m.span
      animate={reducedMotion ? { opacity: 1 } : shown}
      exit={reducedMotion ? { opacity: 0 } : hidden}
      initial={reducedMotion ? { opacity: 0 } : hidden}
      transition={{
        bounce: 0,
        duration: 0.3,
        type: 'spring',
      }}
      {...props}
    />
  )
}
