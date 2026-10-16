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
import { Rover } from './rover'

export type MascotAgent = Awaited<ReturnType<typeof initAgent>>

const MascotContext = createContext<
  { agent: MascotAgent | undefined } | undefined
>(undefined)

export function useMascot() {
  const ctx = useContext(MascotContext)
  if (!ctx) {
    throw new Error('useMascot must be used within MascotProvider')
  }
  return ctx
}

interface MascotProviderProps {
  children?: ReactNode
  disabled?: boolean
}

export function MascotProvider({ children, disabled }: MascotProviderProps) {
  const [currentAgent, setCurrentAgent] = useState<MascotAgent | undefined>()
  const instance = useRef<MascotAgent | null>(null)

  useEffect(() => {
    if (disabled) {
      return
    }

    let cancelled = false

    import('clippyjs')
      .then(({ initAgent }) =>
        initAgent({ ...Rover, sound: () => Promise.resolve({ default: {} }) })
      )
      .then((loaded: MascotAgent) => {
        if (cancelled) {
          loaded.dispose()
          return
        }
        instance.current = loaded
        setCurrentAgent(loaded)
      })
      .catch((error: unknown) => {
        console.error('Failed to load mascot:', error)
      })

    return () => {
      cancelled = true
      instance.current?.dispose()
      instance.current = null
      setCurrentAgent(undefined)
    }
  }, [disabled])

  useEffect(() => {
    if (!currentAgent) {
      return
    }

    currentAgent._el.dataset.nativeCursor = ''

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
      currentAgent._el.removeEventListener('touchstart', blockDrag, {
        capture: true,
      })
    }
  }, [currentAgent])

  const value = useMemo(() => ({ agent: currentAgent }), [currentAgent])

  return (
    <MascotContext.Provider value={value}>{children}</MascotContext.Provider>
  )
}
