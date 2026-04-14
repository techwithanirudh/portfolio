'use client'

import { useEffect, useRef } from 'react'
import type { ClippyAgent } from './provider'

type Animation = string | readonly string[]

function pickAnimation(animation: Animation): string {
  if (typeof animation === 'string') {
    return animation
  }
  return animation[Math.floor(Math.random() * animation.length)] ?? ''
}

export function playAnimation(
  agent: ClippyAgent,
  animation: Animation,
  { interrupt = false }: { interrupt?: boolean } = {}
) {
  if (interrupt) {
    agent.stop()
  }
  agent.play(pickAnimation(animation))
}

export function useJitteredInterval(
  fn: () => void,
  minMs: number,
  jitterMs: number,
  enabled: boolean
) {
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffect(() => {
    if (!enabled) {
      return
    }

    let timer: number
    const schedule = () => {
      timer = window.setTimeout(
        () => {
          fnRef.current()
          schedule()
        },
        minMs + Math.random() * jitterMs
      )
    }
    schedule()

    return () => window.clearTimeout(timer)
  }, [enabled, minMs, jitterMs])
}
