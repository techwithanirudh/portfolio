'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import type { MyUIMessage } from '@/app/api/chat/types'
import { ClippyProvider } from '@/components/clippy'
import { ChatContext } from './chat-context'
import { ChatPanel } from './chat-panel'

export { useChatContextValue as useAISearchContext, useChatContext } from './chat-context'

export function AISearch({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const chat = useChat<MyUIMessage>({
    id: 'search',
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  return (
    <ClippyProvider agentName='Rover' draggable={false}>
      <ChatContext
        value={useMemo(() => ({ chat, open, setOpen }), [chat, open])}
      >
        {children}
        <ChatPanel />
      </ChatContext>
    </ClippyProvider>
  )
}
