'use client'

import type { initAgent } from 'clippyjs'
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

type AgentLoaders = Parameters<typeof initAgent>[0]
export type ClippyAgent = Awaited<ReturnType<typeof initAgent>>

const ClippyContext = createContext<
  { agent: ClippyAgent | undefined } | undefined
>(undefined)

export function useClippy() {
  const ctx = useContext(ClippyContext)
  if (!ctx) {
    throw new Error('useClippy must be used within ClippyProvider')
  }
  return ctx
}

interface ClippyProviderProps {
  agent: AgentLoaders
  children?: ReactNode
}

export function ClippyProvider({ children, agent }: ClippyProviderProps) {
  const [currentAgent, setCurrentAgent] = useState<ClippyAgent | undefined>()
  const instance = useRef<ClippyAgent | null>(null)

  useEffect(() => {
    let cancelled = false

    import('clippyjs')
      .then(({ initAgent }) => initAgent(agent))
      .then((loaded: ClippyAgent) => {
        if (cancelled) {
          loaded.dispose()
          return
        }
        instance.current = loaded
        setCurrentAgent(loaded)
      })
      .catch((error: unknown) => {
        console.error('Failed to load Clippy:', error)
      })

    return () => {
      cancelled = true
      instance.current?.dispose()
      instance.current = null
      setCurrentAgent(undefined)
    }
  }, [agent])

  useEffect(() => {
    if (!currentAgent) {
      return
    }

    const blockDrag = (event: MouseEvent | TouchEvent) => {
      event.stopImmediatePropagation()
    }

    currentAgent._el.addEventListener('mousedown', blockDrag, true)
    currentAgent._el.addEventListener('touchstart', blockDrag, {
      capture: true,
      passive: false,
    })

    return () => {
      currentAgent._el.removeEventListener('mousedown', blockDrag, true)
      currentAgent._el.removeEventListener('touchstart', blockDrag, true)
    }
  }, [currentAgent])

  const value = useMemo(() => ({ agent: currentAgent }), [currentAgent])

  return (
    <ClippyContext.Provider value={value}>{children}</ClippyContext.Provider>
  )
}
