'use client'

import type { Agent } from 'clippyts'
import { createContext } from 'react'

export interface ClippyContextValue {
  agent: Agent | undefined
  isLoaded: boolean
}

export const ClippyContext = createContext<ClippyContextValue>({
  agent: undefined,
  isLoaded: false,
})
