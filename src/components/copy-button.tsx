'use client'

import type { HTMLMotionProps, Variants } from 'motion/react'
import { AnimatePresence, motion } from 'motion/react'
import { Icons } from '@/components/icons/icons'
import type { CopyState } from '@/hooks/use-copy-to-clipboard'

const motionIconVariants: Variants = {
  animate: { filter: 'blur(0px)', opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  initial: { filter: 'blur(2px)', opacity: 0, scale: 0.8 },
}

const motionIconProps: HTMLMotionProps<'span'> = {
  animate: 'animate',
  exit: 'exit',
  initial: 'initial',
  transition: { duration: 0.15, ease: 'easeOut' },
  variants: motionIconVariants,
}

interface CopyStateIconProps {
  doneIcon?: React.ReactNode
  errorIcon?: React.ReactNode
  idleIcon?: React.ReactNode
  state: CopyState
}

export function CopyStateIcon({
  state,
  idleIcon,
  doneIcon,
  errorIcon,
}: CopyStateIconProps) {
  const iconByState = {
    done: doneIcon ?? <Icons.check data-slot='done-icon' />,
    error: errorIcon ?? <Icons.error data-slot='error-icon' />,
    idle: idleIcon ?? <Icons.copy data-slot='idle-icon' />,
  }

  // Outgoing and incoming icons share one grid cell, so the swap never
  // changes the box size and nothing around it shifts
  return (
    <span className='inline-grid shrink-0 place-items-center align-middle *:[grid-area:1/1]'>
      <AnimatePresence initial={false}>
        <motion.span className='inline-flex' key={state} {...motionIconProps}>
          {iconByState[state]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
