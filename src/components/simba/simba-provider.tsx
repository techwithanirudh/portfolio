'use client'

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { AgentConfig } from './simba-engine'
import { SimbaEngine } from './simba-engine'
import { SimbaContext, type SimbaContextValue } from './simba-context'

function applyFrameStyles(el: HTMLDivElement, config: AgentConfig) {
  const w = config.frameWidth * config.scale
  const h = config.frameHeight * config.scale
  const bgW = config.cols * config.frameWidth * config.scale
  const bgH =
    Object.keys(config.animations).length * config.frameHeight * config.scale
  el.style.width = `${w}px`
  el.style.height = `${h}px`
  el.style.backgroundSize = `${bgW}px ${bgH}px`
}

export function SimbaProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const spriteRef = useRef<HTMLDivElement | null>(null)
  const configRef = useRef<AgentConfig | null>(null)
  const engineRef = useRef<SimbaEngine | null>(null)

  useEffect(() => {
    const engine = new SimbaEngine((x, y) => {
      if (spriteRef.current) {
        spriteRef.current.style.backgroundPosition = `-${x}px -${y}px`
      }
    })
    engineRef.current = engine

    fetch('/agents/Simba.json')
      .then((r) => r.json() as Promise<AgentConfig>)
      .then((config) => {
        configRef.current = config
        engine.setConfig(config)

        // Size the sprite element if already mounted
        if (spriteRef.current) applyFrameStyles(spriteRef.current, config)

        // Start idle loop
        const idle = config.animations['Idle']
        if (idle) engine.play(idle)

        setIsReady(true)
      })
      .catch((err: unknown) => {
        console.error('SimbaProvider: failed to load Simba.json', err)
      })

    return () => {
      engine.stop()
      engineRef.current = null
    }
  }, [])

  const attachSprite = useCallback((el: HTMLDivElement | null) => {
    spriteRef.current = el
    // Config may already be loaded if dynamic import resolved after fetch
    if (el && configRef.current) applyFrameStyles(el, configRef.current)
  }, [])

  const playIdle = useCallback(() => {
    const idle = configRef.current?.animations['Idle']
    if (idle) engineRef.current?.play(idle)
  }, [])

  const play = useCallback(
    (name: string) => {
      const anim = configRef.current?.animations[name]
      if (!anim) return
      engineRef.current?.play(anim, anim.loop ? undefined : playIdle)
    },
    [playIdle]
  )

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
