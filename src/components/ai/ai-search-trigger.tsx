'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { ClippyProvider, useClippy } from '@/components/clippy'
import { useAISearchContext } from './ai-search'

function ClippyAnimations() {
  const { agent, isLoaded, play } = useClippy()
  const { chat } = useAISearchContext()
  const isThinking = chat.status === 'streaming' || chat.status === 'submitted'

  useEffect(() => {
    if (!(isLoaded && agent)) {
      return
    }

    if (isThinking) {
      play('Searching')
    }
  }, [agent, isLoaded, isThinking, play])

  return null
}

function ClippyTriggerInner() {
  const { open, setOpen } = useAISearchContext()

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <ClippyProvider
      agentName='Rover'
      draggable={false}
      onClick={handleClick}
      resetPositionOnResize
    >
      <ClippyAnimations />
    </ClippyProvider>
  )
}

export const AISearchTrigger = dynamic(
  () => Promise.resolve(ClippyTriggerInner),
  { ssr: false }
)
