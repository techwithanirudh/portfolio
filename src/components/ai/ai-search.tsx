'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import type { MyUIMessage } from '@/app/api/chat/types'
import { ClippyProvider } from '@/components/clippy'
import { ChatContext } from './chat-context'
import { ChatPanel } from './chat-panel'
import { SelectionContextMenu } from './selection-context-menu'

export function AISearch({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [pendingContext, setPendingContext] = useState<string | null>(null)
  const chat = useChat<MyUIMessage>({
    id: 'search',
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const handleSelectContext = useCallback((text: string) => {
    setPendingContext(text)
    setOpen(true)
  }, [])

  return (
    <ClippyProvider agentName='Rover' draggable={false}>
      <ChatContext
        value={useMemo(
          () => ({ chat, open, setOpen, pendingContext, setPendingContext }),
          [chat, open, pendingContext]
        )}
      >
        {children}
        <ChatPanel />
        <SelectionContextMenu onSelect={handleSelectContext} />
      </ChatContext>
    </ClippyProvider>
  )
}
