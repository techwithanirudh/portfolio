'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { ClippyProvider } from '@/components/clippy'
import { AISearchContext } from './ai-search-context'
import { AISearchPanel } from './ai-search-panel'

export { useAISearchContext } from './ai-search-context'
export { AISearchPanel } from './ai-search-panel'

export function AISearch({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const chat = useChat({
    id: 'search',
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  return (
    <ClippyProvider agentName='Rover' draggable={false}>
      <AISearchContext.Provider
        value={useMemo(() => ({ chat, open, setOpen }), [chat, open])}
      >
        {children}
        <AISearchPanel />
      </AISearchContext.Provider>
    </ClippyProvider>
  )
}
