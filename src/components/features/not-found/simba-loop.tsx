'use client'

import Rover from 'clippyjs/agents/rover'
import { useEffect, useState } from 'react'
import { sprite } from '@/components/features/assistant/mascot/constants'
import { prefersReducedMotion } from '@/lib/reduced-motion'

const [FRAME] = sprite.frame
const [SHEET_WIDTH] = sprite.sheet

type AnimationName = keyof Awaited<
  ReturnType<typeof Rover.agent>
>['default']['animations']

interface Frame {
  duration: number
  position: readonly [number, number]
}

// Plays one of the mascot's sprite sheet animations on repeat, resting a beat
// between runs. Branching frames are ignored, so it always plays straight through.
export function SimbaLoop({
  animation,
  className,
  pause = 1200,
  size = `${FRAME * 2}px`,
}: {
  animation: AnimationName
  className?: string
  /** Any CSS length for one frame, so it can scale with text via em */
  size?: string
  /** ms */
  pause?: number
}) {
  const [frames, setFrames] = useState<Frame[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) {
      return
    }
    let cancelled = false
    Rover.agent().then(({ default: agent }) => {
      if (cancelled) {
        return
      }
      let position: Frame['position'] = [0, 0]
      setFrames(
        agent.animations[animation].frames.map((frame) => {
          const [x = 0, y = 0] = frame.images?.[0] ?? position
          position = [x, y]
          return { duration: frame.duration, position }
        })
      )
    })
    return () => {
      cancelled = true
    }
  }, [animation])

  useEffect(() => {
    if (frames.length === 0) {
      return
    }
    const last = index === frames.length - 1
    const timer = setTimeout(
      () => setIndex(last ? 0 : index + 1),
      (frames[index]?.duration ?? 100) + (last ? pause : 0)
    )
    return () => clearTimeout(timer)
  }, [frames, index, pause])

  const [x, y] = frames[index]?.position ?? [0, 0]

  return (
    <div
      aria-hidden
      className={className}
      style={{
        backgroundImage: `url(${sprite.src})`,
        backgroundPosition: `calc(${size} * ${-x / FRAME}) calc(${size} * ${-y / FRAME})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `calc(${size} * ${SHEET_WIDTH / FRAME}) auto`,
        height: size,
        imageRendering: 'pixelated',
        width: size,
      }}
    />
  )
}
