'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { ClippyProvider } from '@/components/clippy'
import { AISearchContext } from './ai-search-context'

const LazyAISearchPanel = dynamic(
  () => import('./ai-search-panel').then((mod) => mod.AISearchPanel),
  { ssr: false }
)

export { useAISearchContext } from './ai-search-context'

export function AISearch({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const chat = useChat({
    id: 'search',
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  useEffect(() => {
    if (open) {
      setHasOpened(true)
    }
  }, [open])

  useEffect(() => {
    const onKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        event.preventDefault()
      }

      if (event.key === '/' && (event.metaKey || event.ctrlKey) && !open) {
        setOpen(true)
        event.preventDefault()
      }
    }

    window.addEventListener('keydown', onKeyPress)
    return () => window.removeEventListener('keydown', onKeyPress)
  }, [open])

  return (
    <ClippyProvider agentName='Rover' draggable={false}>
      <AISearchContext.Provider
        value={useMemo(() => ({ chat, open, setOpen }), [chat, open])}
      >
        {children}
        {hasOpened || open ? <LazyAISearchPanel /> : null}
      </AISearchContext.Provider>
    </ClippyProvider>
  )
}
