'use client'

import type { Agent } from 'clippyts'
import type { AgentType } from 'clippyts/dist/types'
import { createContext, useContext } from 'react'

export interface ClippyContextValue {
  clippy: Agent | undefined
  element: HTMLElement | null
  agentName: AgentType
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
