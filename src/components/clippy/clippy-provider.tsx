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
type ClippyAgent = Awaited<ReturnType<typeof initAgent>>

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
  character: AgentLoaders
  children?: ReactNode
}

export function ClippyProvider({ children, character }: ClippyProviderProps) {
  const [agent, setAgent] = useState<ClippyAgent | undefined>()
  const instance = useRef<ClippyAgent | null>(null)

  useEffect(() => {
    let cancelled = false

    character
      .map()
      .then(({ default: mapUrl }: { default: string }) => {
        const image = new Image()
        image.decoding = 'async'
        image.src = mapUrl
        if (image.complete) {
          return
        }
        return new Promise<void>((resolve) => {
          image.addEventListener('load', () => resolve(), { once: true })
          image.addEventListener('error', () => resolve(), { once: true })
        })
      })
      .then(async () => {
        const { initAgent } = await import('clippyjs')
        return initAgent(character)
      })
      .then((loaded: ClippyAgent) => {
        if (cancelled) {
          loaded.dispose()
          return
        }
        instance.current = loaded
        setAgent(loaded)
      })
      .catch((error: unknown) => {
        console.error('Failed to load Clippy:', error)
      })

    return () => {
      cancelled = true
      instance.current?.dispose()
      instance.current = null
      setAgent(undefined)
    }
  }, [character])

  useEffect(() => {
    if (!agent) {
      return
    }

    const blockDrag = (event: MouseEvent | TouchEvent) => {
      event.stopImmediatePropagation()
    }

    agent._el.addEventListener('mousedown', blockDrag, true)
    agent._el.addEventListener('touchstart', blockDrag, {
      capture: true,
      passive: false,
    })

    return () => {
      agent._el.removeEventListener('mousedown', blockDrag, true)
      agent._el.removeEventListener('touchstart', blockDrag, true)
    }
  }, [agent])

  const value = useMemo(() => ({ agent }), [agent])

  return (
    <ClippyContext.Provider value={value}>{children}</ClippyContext.Provider>
  )
}
