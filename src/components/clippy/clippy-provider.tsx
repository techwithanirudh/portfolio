'use client'

import type { initAgent } from 'clippyjs'
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import {
  type ClippyAgent,
  ClippyContext,
  type ClippyContextValue,
} from './clippy-context'

type Agent = Parameters<typeof initAgent>[0]

interface ClippyProviderProps {
  agent: Agent
  children?: ReactNode
}

export function ClippyProvider({ children, agent }: ClippyProviderProps) {
  const [currentAgent, setCurrentAgent] = useState<ClippyAgent | undefined>()
  const instance = useRef<ClippyAgent | null>(null)

  useEffect(() => {
    let cancelled = false

    agent
      .map()
      .then(({ default: mapUrl }) => {
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
        return initAgent(agent)
      })
      .then((loaded) => {
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

  const value = useMemo<ClippyContextValue>(
    () => ({ agent: currentAgent }),
    [currentAgent]
  )

  return (
    <ClippyContext.Provider value={value}>{children}</ClippyContext.Provider>
  )
}
