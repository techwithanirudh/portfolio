'use client'

import type { UseChatHelpers } from '@ai-sdk/react'
import { createContext, use } from 'react'
import type { MyUIMessage } from '@/app/api/chat/types'

export interface ChatContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  chat: UseChatHelpers<MyUIMessage>
  pendingContext: string | null
  setPendingContext: (ctx: string | null) => void
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
