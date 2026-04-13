'use client'

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { Animation } from './floppy-engine'
import { FloppyEngine } from './floppy-engine'
import { FloppyContext, type FloppyContextValue } from './floppy-context'

type AgentData = {
  framesize: [number, number]
  animations: Record<string, Animation>
}

export function FloppyProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const spriteRef = useRef<HTMLDivElement | null>(null)
  const animationsRef = useRef<AgentData['animations'] | null>(null)
  const engineRef = useRef<FloppyEngine | null>(null)

  useEffect(() => {
    const engine = new FloppyEngine((x, y) => {
      if (spriteRef.current) {
        spriteRef.current.style.backgroundPosition = `-${x}px -${y}px`
      }
    })
    engineRef.current = engine

    fetch('/agents/Rover.json')
      .then((r) => r.json() as Promise<AgentData>)
      .then((data) => {
        animationsRef.current = data.animations
        setIsReady(true)
      })
      .catch((err: unknown) => {
        console.error('FloppyProvider: failed to load Rover.json', err)
      })

    return () => {
      engine.stop()
      engineRef.current = null
    }
  }, [])

  const attachSprite = useCallback((el: HTMLDivElement | null) => {
    spriteRef.current = el
  }, [])

  const play = useCallback((name: string) => {
    const animation = animationsRef.current?.[name]
    if (animation) engineRef.current?.play(animation)
  }, [])

  const stop = useCallback(() => {
    engineRef.current?.stop()
  }, [])

  const value = useMemo<FloppyContextValue>(
    () => ({ play, stop, isReady, attachSprite }),
    [play, stop, isReady, attachSprite]
  )

  return (
    <FloppyContext.Provider value={value}>{children}</FloppyContext.Provider>
  )
}
