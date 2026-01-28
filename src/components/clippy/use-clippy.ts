'use client'

import { useContext } from 'react'
import { ClippyContext } from './clippy-context'

export function useClippy() {
  const { agent, isLoaded } = useContext(ClippyContext)

  return {
    agent,
    isLoaded,
    speak: (text: string, hold = false) => agent?.speak(text, hold),
    play: (animation: string) => agent?.play(animation),
    animate: () => agent?.animate(),
    show: (fast = true) => agent?.show(fast),
    hide: (fast = true, cb?: () => void) =>
      agent?.hide(fast, cb ?? (() => undefined)),
    moveTo: (x: number, y: number, duration = 0) =>
      agent?.moveTo(x, y, duration),
    gestureAt: (x: number, y: number) => agent?.gestureAt(x, y),
    stopCurrent: () => agent?.stopCurrent(),
    stop: () => agent?.stop(),
  }
}
