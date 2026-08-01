'use client'

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  use,
  useMemo,
  useState,
} from 'react'

interface AISearchState {
  context: string | null
  open: boolean
  setContext: Dispatch<SetStateAction<string | null>>
  setOpen: Dispatch<SetStateAction<boolean>>
}

const AISearchContext = createContext<AISearchState | null>(null)

export function useAISearchContext() {
  const ctx = use(AISearchContext)
  if (!ctx) {
    throw new Error('useAISearchContext must be used within AISearchProvider')
  }
  return ctx
}

export function AISearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [context, setContext] = useState<string | null>(null)

  const value = useMemo(
    () => ({ context, open, setContext, setOpen }),
    [context, open]
  )

  return <AISearchContext value={value}>{children}</AISearchContext>
}
