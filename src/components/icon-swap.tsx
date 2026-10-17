'use client'

// Icon Swap by Chánh Đại (MIT): https://chanhdai.com/components/icon-swap
// https://github.com/ncdai/chanhdai.com/blob/main/src/registry/components/icon-swap/icon-swap.tsx
import type { AnimatePresenceProps, HTMLMotionProps } from 'motion/react'
import { AnimatePresence, m } from 'motion/react'

export function IconSwap(props: React.PropsWithChildren<AnimatePresenceProps>) {
  return <AnimatePresence initial={false} mode='popLayout' {...props} />
}

type MotionElement = typeof m.div | typeof m.span

export function IconSwapItem({
  as: Component = m.div,
  ...props
}: HTMLMotionProps<'div'> & {
  as?: MotionElement
}) {
  return (
    <Component
      animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
      exit={{ filter: 'blur(4px)', opacity: 0, scale: 0.25 }}
      initial={{ filter: 'blur(4px)', opacity: 0, scale: 0.25 }}
      transition={{
        bounce: 0,
        duration: 0.3,
        type: 'spring',
      }}
      {...props}
    />
  )
}
