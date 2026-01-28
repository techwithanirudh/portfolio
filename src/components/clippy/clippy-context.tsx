'use client'

import type { Agent } from 'clippyts'
import { createContext } from 'react'

export interface ClippyContextValue {
  clippy: Agent | undefined
}

export const ClippyContext = createContext<ClippyContextValue>({
  clippy: undefined,
})
