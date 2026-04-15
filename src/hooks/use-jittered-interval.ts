'use client'

import { useEffect, useEffectEvent } from 'react'

export function useJitteredInterval(
  fn: () => void,
  minMs: number,
  jitterMs: number,
  enabled: boolean
) {
  const callback = useEffectEvent(fn)

  useEffect(() => {
    if (!enabled) {
      return
    }

    let timer: number
    const schedule = () => {
      timer = window.setTimeout(
        () => {
          callback()
          schedule()
        },
        minMs + Math.random() * jitterMs
      )
    }
    schedule()

    return () => window.clearTimeout(timer)
  }, [enabled, minMs, jitterMs])
}
