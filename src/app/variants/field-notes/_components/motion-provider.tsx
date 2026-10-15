'use client'

import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'

/** One reduced-motion switch for the whole variant. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion='user'>{children}</MotionConfig>
}
