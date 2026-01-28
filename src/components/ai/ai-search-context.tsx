'use client'

import type { UIMessage, UseChatHelpers } from '@ai-sdk/react'
import { createContext, useContext } from 'react'

export const AISearchContext = createContext<{
  open: boolean
  setOpen: (open: boolean) => void
  chat: UseChatHelpers<UIMessage>
} | null>(null)

export function useAISearchContext() {
  const ctx = useContext(AISearchContext)
  if (!ctx) {
    throw new Error('useAISearchContext must be used within AISearch')
  }
  return { open: ctx.open, setOpen: ctx.setOpen, chat: ctx.chat }
}

export function useChatContext() {
  const ctx = useContext(AISearchContext)
  if (!ctx) {
    throw new Error('useChatContext must be used within AISearch')
  }
  return ctx.chat
}
