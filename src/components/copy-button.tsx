'use client'

import {
  CancelCircleIcon,
  Copy01Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { HTMLMotionProps, Variants } from 'motion/react'
import { AnimatePresence, motion } from 'motion/react'
import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import type { CopyState } from '@/hooks/use-copy-to-clipboard'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'

export const motionIconVariants: Variants = {
  initial: { opacity: 0, scale: 0.8, filter: 'blur(2px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.8 },
}

export const motionIconProps: HTMLMotionProps<'span'> = {
  variants: motionIconVariants,
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  transition: { duration: 0.15, ease: 'easeOut' },
}

export interface CopyStateIconProps {
  /** Custom icon for done state. */
  doneIcon?: React.ReactNode
  /** Custom icon for error state. */
  errorIcon?: React.ReactNode
  /** Custom icon for idle state. */
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
    idle: idleIcon ?? (
      <HugeiconsIcon data-slot='idle-icon' icon={Copy01Icon} strokeWidth={2} />
    ),
    done: doneIcon ?? (
      <HugeiconsIcon data-slot='done-icon' icon={Tick02Icon} strokeWidth={2} />
    ),
    error: errorIcon ?? (
      <HugeiconsIcon
        data-slot='error-icon'
        icon={CancelCircleIcon}
        strokeWidth={2}
      />
    ),
  }

  return (
    <AnimatePresence initial={false} mode='popLayout'>
      <motion.span key={state} {...motionIconProps}>
        {iconByState[state]}
      </motion.span>
    </AnimatePresence>
  )
}

export type CopyButtonProps = ComponentProps<typeof Button> & {
  /** The text to copy, or a function that returns the text. */
  text: string | (() => string)
  /** Called with the copied text on successful copy. */
  onCopySuccess?: (text: string) => void
  /** Called with the error if the copy operation fails. */
  onCopyError?: (error: Error) => void
} & Omit<CopyStateIconProps, 'state'>

export function CopyButton({
  size = 'icon',
  children,
  text,
  idleIcon,
  doneIcon,
  errorIcon,
  onClick,
  onCopySuccess,
  onCopyError,
  ...props
}: CopyButtonProps) {
  const { state, copy } = useCopyToClipboard({
    onCopySuccess,
    onCopyError,
  })

  return (
    <Button
      aria-label='Copy'
      className='will-change-transform'
      onClick={(e) => {
        copy(text)
        onClick?.(e)
      }}
      size={size}
      {...props}
    >
      <CopyStateIcon
        doneIcon={doneIcon}
        errorIcon={errorIcon}
        idleIcon={idleIcon}
        state={state}
      />
      {children}
    </Button>
  )
}
