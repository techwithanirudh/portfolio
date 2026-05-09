'use client'

import { motion, useAnimation } from 'motion/react'
import { forwardRef, useImperativeHandle } from 'react'

export interface ChevronsUpDownIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

export type ChevronsUpDownIconProps = React.ComponentProps<'svg'> & {
  duration?: number
}

// biome-ignore lint/suspicious/noReactForwardRef: custom handle type requires forwardRef
const ChevronsUpDownIcon = forwardRef<
  ChevronsUpDownIconHandle,
  ChevronsUpDownIconProps
>(({ duration = 0.3, ...props }, ref) => {
  const controls = useAnimation()

  useImperativeHandle(ref, () => ({
    startAnimation: () => controls.start('animate'),
    stopAnimation: () => controls.start('normal'),
  }))

  return (
    <svg
      aria-hidden
      fill='none'
      height='24'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      viewBox='0 0 24 24'
      width='24'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <motion.path
        animate={controls}
        d='M7 15L12 20L17 15'
        initial='normal'
        transition={{ duration }}
        variants={{
          normal: { d: 'M7 15L12 20L17 15' },
          animate: { d: 'M7 20L12 15L17 20' },
        }}
      />
      <motion.path
        animate={controls}
        d='M7 9L12 4L17 9'
        initial='normal'
        transition={{ duration }}
        variants={{
          normal: { d: 'M7 9L12 4L17 9' },
          animate: { d: 'M7 4L12 9L17 4' },
        }}
      />
    </svg>
  )
})

ChevronsUpDownIcon.displayName = 'ChevronsUpDownIcon'

export { ChevronsUpDownIcon }
