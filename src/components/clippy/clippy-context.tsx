'use client'

import type { initAgent } from 'clippyjs'
import { createContext, useContext } from 'react'

export type ClippyAgent = Awaited<ReturnType<typeof initAgent>>

export interface ClippyContextValue {
  agent: ClippyAgent | undefined
}

export const ClippyContext = createContext<ClippyContextValue | undefined>(
  undefined
)

export function useClippy() {
  const ctx = useContext(ClippyContext)
  if (!ctx) {
    throw new Error('useClippy must be used within ClippyProvider')
  }
  return ctx
}
