'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { SIMBA_SPRITE, simbaAgent } from './agents/simba'

type AnimationName = keyof typeof simbaAgent.animations

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
  const { frames } = simbaAgent.animations[animation]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    const last = index === frames.length - 1
    const timer = setTimeout(
      () => setIndex(last ? 0 : index + 1),
      (frames[index]?.duration ?? 100) + (last ? pause : 0)
    )
    return () => clearTimeout(timer)
  }, [frames, index, pause])

  const [x = 0, y = 0] = frames[index]?.images[0] ?? []
  const [width, height] = simbaAgent.framesize

  return (
    <span
      aria-hidden
      className={cn('block shrink-0 bg-no-repeat', className)}
      style={{
        backgroundImage: `url(${SIMBA_SPRITE})`,
        backgroundPosition: `-${x}px -${y}px`,
        height,
        width,
      }}
    />
  )
}
