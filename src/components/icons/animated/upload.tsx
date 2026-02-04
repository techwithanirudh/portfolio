'use client'

import type { Variants } from 'motion/react'
import { motion, useAnimation } from 'motion/react'
import type { SVGProps } from 'react'
import { forwardRef, useImperativeHandle } from 'react'

import { cn } from '@/lib/utils'

export interface UploadIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface UploadIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

const ARROW_VARIANTS: Variants = {
  normal: { y: 0 },
  animate: {
    y: -2,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 10,
      mass: 1,
    },
  },
}

const UploadIcon = forwardRef<UploadIconHandle, UploadIconProps>(
  ({ className, size = 28, ...props }, ref) => {
    const controls = useAnimation()
    useImperativeHandle(ref, () => ({
      startAnimation: () => controls.start('animate'),
      stopAnimation: () => controls.start('normal'),
    }))

    return (
      <svg
        aria-hidden={props['aria-label'] ? undefined : true}
        className={cn(className)}
        fill='none'
        height={size}
        role={props['aria-label'] ? 'img' : undefined}
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        viewBox='0 0 24 24'
        width={size}
        xmlns='http://www.w3.org/2000/svg'
        {...props}
      >
        <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
        <motion.g animate={controls} variants={ARROW_VARIANTS}>
          <polyline points='17 8 12 3 7 8' />
          <line x1='12' x2='12' y1='3' y2='15' />
        </motion.g>
      </svg>
    )
  }
)

UploadIcon.displayName = 'UploadIcon'

export { UploadIcon }
