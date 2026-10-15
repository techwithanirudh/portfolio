'use client'

import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { cn } from '@/lib/utils'
import { type AnimationName, SIMBA } from './constants'

// Plays one of Simba's sprite animations on a loop, outside the assistant.
// Reduced motion keeps him on the first frame.
export function SimbaLoop({
  animation,
  className,
  pause = 1200,
}: {
  animation: AnimationName
  className?: string
  /** Rest on the last frame between loops, in ms */
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
  const [width, height] = SIMBA.frame

  return (
    <span
      aria-hidden
      className={cn('block shrink-0 bg-no-repeat', className)}
      style={{
        backgroundImage: `url(${SIMBA.sprite})`,
        backgroundPosition: `-${x}px -${y}px`,
        height,
        width,
      }}
    />
  )
}
