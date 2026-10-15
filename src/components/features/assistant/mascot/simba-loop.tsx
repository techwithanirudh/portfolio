'use client'

import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { type AnimationName, SIMBA } from './constants'
import { SimbaFrame } from './frame'

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

  const { x = 0, y = 0 } = frames[index] ?? {}

  return <SimbaFrame className={className} x={x} y={y} />
}
