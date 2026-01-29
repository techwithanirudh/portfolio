'use client'

import type { UIMessage, UseChatHelpers } from '@ai-sdk/react'
import { createContext, use } from 'react'

export interface ChatContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  chat: UseChatHelpers<UIMessage>
}

export const ChatContext = createContext<ChatContextValue | null>(null)

export function useChatContextValue() {
  const ctx = use(ChatContext)
  if (!ctx) {
    throw new Error('useChatContextValue must be used within ChatContext')
  }
  return ctx
}

export function useChatContext() {
  return useChatContextValue().chat
}
