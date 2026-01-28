'use client'

import type { Agent } from 'clippyts'
import type { AgentType } from 'clippyts/dist/types'
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { ClippyContext } from './clippy-context'

const AGENTS = {
  BONZI: 'Bonzi',
  CLIPPY: 'Clippy',
  F1: 'F1',
  GENIE: 'Genie',
  GENIUS: 'Genius',
  LINKS: 'Links',
  MERLIN: 'Merlin',
  PEEDY: 'Peedy',
  ROCKY: 'Rocky',
  ROVER: 'Rover',
} as const

interface ClippyProviderProps {
  children?: ReactNode
  agentName?: AgentType
  selector?: string
  draggable?: boolean
  onLoad?: (agent: Agent) => void
}

export function ClippyProvider({
  children,
  agentName = AGENTS.ROVER,
  selector = 'clippy-container',
  draggable = false,
  onLoad,
}: ClippyProviderProps) {
  const [agent, setAgent] = useState<Agent | undefined>()
  const [isLoaded, setIsLoaded] = useState(false)
  const agentRef = useRef<Agent | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadClippy() {
      const clippy = (await import('clippyts')).default

      clippy.load({
        name: agentName,
        selector,
        successCb: (loadedAgent) => {
          if (!mounted) {
            loadedAgent.hide(true, () => undefined)
            return
          }

          agentRef.current = loadedAgent
          setAgent(loadedAgent)
          setIsLoaded(true)

          if (!draggable) {
            for (const el of document.querySelectorAll('.clippy')) {
              el.addEventListener(
                'mousedown',
                (e) => e.stopImmediatePropagation(),
                true
              )
            }
          }

          onLoad?.(loadedAgent)
        },
        failCb: (err) => console.error('Failed to load Clippy:', err),
      })
    }

    loadClippy()

    return () => {
      mounted = false
      agentRef.current?.hide(true, () => undefined)
    }
  }, [agentName, selector, draggable, onLoad])

  const value = useMemo(() => ({ agent, isLoaded }), [agent, isLoaded])

  return (
    <>
      <div className={selector} />
      <ClippyContext value={value}>{children}</ClippyContext>
    </>
  )
}

export { AGENTS }
