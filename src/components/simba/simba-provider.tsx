'use client'

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { Animation } from './simba-engine'
import { SimbaEngine } from './simba-engine'
import { SimbaContext, type SimbaContextValue } from './simba-context'

type AgentData = {
  framesize: [number, number]
  animations: Record<string, Animation>
}

export function SimbaProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const spriteRef = useRef<HTMLDivElement | null>(null)
  const animationsRef = useRef<AgentData['animations'] | null>(null)
  const engineRef = useRef<SimbaEngine | null>(null)

  useEffect(() => {
    const engine = new SimbaEngine((x, y) => {
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
        console.error('SimbaProvider: failed to load Rover.json', err)
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

  const value = useMemo<SimbaContextValue>(
    () => ({ play, stop, isReady, attachSprite }),
    [play, stop, isReady, attachSprite]
  )

  return (
    <SimbaContext.Provider value={value}>{children}</SimbaContext.Provider>
  )
}
