'use client'

import { createContext, useContext } from 'react'

export interface FloppyContextValue {
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

export const FloppyContext = createContext<FloppyContextValue | undefined>(undefined)

export function useFloppyAgent(): FloppyContextValue {
  const ctx = useContext(FloppyContext)
  if (!ctx) throw new Error('useFloppyAgent must be used within FloppyProvider')
  return ctx
}
