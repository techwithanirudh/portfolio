'use client'

import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'

/** One `MotionConfig` for the whole variant, honouring the OS motion setting. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion='user'>{children}</MotionConfig>
}
