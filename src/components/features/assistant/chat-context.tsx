'use client'

import type { UseChatHelpers } from '@ai-sdk/react'
import { createContext, use } from 'react'
import type { MyUIMessage } from '@/lib/ai/chat/types'

export const ChatContext = createContext<UseChatHelpers<MyUIMessage> | null>(
  null
)

export function useChatContext() {
  const ctx = use(ChatContext)
  if (!ctx) {
    throw new Error('useChatContext must be used within Assistant')
  }
  return ctx
}
