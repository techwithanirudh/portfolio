'use client'

import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'

/** One reduced-motion switch for every motion component in the variant. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion='user'>{children}</MotionConfig>
}
