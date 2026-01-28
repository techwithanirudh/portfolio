'use client'

import type { Agent } from 'clippyts'
import { createContext } from 'react'

export type ClippyEventHandler = (event: Event, agent: Agent) => void

export type ClippyInstance = Agent & {
  on: (eventName: string, handler: ClippyEventHandler) => void
  off: (eventName: string, handler: ClippyEventHandler) => void
}

export interface ClippyContextValue {
  clippy: ClippyInstance | undefined
}

export const ClippyContext = createContext<ClippyContextValue>({
  clippy: undefined,
})
