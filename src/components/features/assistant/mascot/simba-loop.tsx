'use client'

import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { type AnimationName, SIMBA } from './constants'
import { SimbaRig } from './rig'

export function SimbaLoop({
  animation,
  className,
  pause = 1200,
}: {
  animation: AnimationName
  className?: string
  /** ms */
  pause?: number
}) {
  const { frames } = SIMBA.animations[animation]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) {
      return
    }
    const last = index === frames.length - 1
    const timer = setTimeout(
      () => setIndex(last ? 0 : index + 1),
      (frames[index]?.duration ?? 100) + (last ? pause : 0)
    )
    return () => clearTimeout(timer)
  }, [frames, index, pause])

  return <SimbaRig className={className} pose={frames[index]?.pose ?? 'rest'} />
}
