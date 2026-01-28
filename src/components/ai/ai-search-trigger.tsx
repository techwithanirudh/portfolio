'use client'

import type { Agent } from 'clippyts'
import dynamic from 'next/dynamic'
import { useCallback } from 'react'
import { ClippyProvider } from '@/components/clippy'
import { useAISearchContext } from './ai-search'

function getPosition() {
  return {
    x: window.innerWidth - 90,
    y: window.innerHeight - 100,
  }
}

function ClippyTriggerInner() {
  const { open, setOpen } = useAISearchContext()

  const handleLoad = useCallback(
    (agent: Agent) => {
      agent.show(true)
      const { x, y } = getPosition()
      agent.moveTo(x, y, 0)

      const el = document.querySelector('.clippy-container')
      el?.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        setOpen(!open)
      })

      window.addEventListener('resize', () => {
        const { x, y } = getPosition()
        agent.moveTo(x, y, 0)
      })
    },
    [open, setOpen]
  )

  return (
    <ClippyProvider agentName='Clippy' draggable={false} onLoad={handleLoad} />
  )
}

export const AISearchTrigger = dynamic(
  () => Promise.resolve(ClippyTriggerInner),
  { ssr: false }
)
