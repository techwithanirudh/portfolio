'use client'

import { createContext, useContext } from 'react'

export interface SimbaContextValue {
  /** Play a named animation (e.g. 'LookUp', 'Hide', 'Books', 'Searching'). */
  play: (name: string) => void
  /** Stop the current animation immediately. */
  stop: () => void
  /** True once the animation JSON has been fetched and the engine is ready. */
  isReady: boolean
  /**
   * Callback ref — pass this to the sprite `<div>` so the engine can update
   * its `backgroundPosition` directly without triggering React re-renders.
   */
  attachSprite: (el: HTMLDivElement | null) => void
}

export const SimbaContext = createContext<SimbaContextValue | undefined>(undefined)

export function useSimba(): SimbaContextValue {
  const ctx = useContext(SimbaContext)
  if (!ctx) throw new Error('useSimba must be used within SimbaProvider')
  return ctx
}
