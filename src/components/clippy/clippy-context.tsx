'use client'

import type { Agent } from 'clippyts'
import type { AgentType } from 'clippyts/dist/types'
import { createContext } from 'react'

export type ClippyEventHandler = (event: Event, agent: Agent) => void

export type ClippyInstance = Agent & {
  on: (eventName: string, handler: ClippyEventHandler) => void
  off: (eventName: string, handler: ClippyEventHandler) => void
}

export interface ClippyContextValue {
  clippy: ClippyInstance | undefined
  currentAgent: AgentType | null
  isAgentVisible: boolean
  isLoadingAgent: boolean
  showAgent: (agentName: AgentType, fast?: boolean) => void
  hideAgent: (fast?: boolean) => void
  showMessage: (message: string, timeoutMs?: number) => void
  playAnimation: (animationName?: string) => void
  cancelAnimation: () => void
  moveTo: (x: number, y: number, durationMs?: number) => void
  gestureAt: (x: number, y: number) => void
}

export const ClippyContext = createContext<ClippyContextValue | undefined>(
  undefined
)
