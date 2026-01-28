'use client'

import type { AgentType } from 'clippyts/dist/types'

export interface ClippyState {
  currentAgent: AgentType | null
  isAgentVisible: boolean
  isLoadingAgent: boolean
}

export type ClippyAction =
  | { type: 'loading' }
  | { type: 'loaded'; agentName: AgentType }
  | { type: 'hidden' }
  | { type: 'failed' }

export const initialClippyState: ClippyState = {
  currentAgent: null,
  isAgentVisible: false,
  isLoadingAgent: false,
}

export const clippyReducer = (
  state: ClippyState,
  action: ClippyAction
): ClippyState => {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        isLoadingAgent: true,
      }
    case 'loaded':
      return {
        currentAgent: action.agentName,
        isAgentVisible: true,
        isLoadingAgent: false,
      }
    case 'hidden':
    case 'failed':
      return {
        currentAgent: null,
        isAgentVisible: false,
        isLoadingAgent: false,
      }
    default:
      return state
  }
}
