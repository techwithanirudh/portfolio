'use client'

import { useEffect, useRef } from 'react'
import {
  createOiiaEngine,
  type OiiaEngine as OiiaEngineHandle,
} from './physics'
import { useOiiaMode } from './provider'

export function OiiaEngine() {
  const { mode, setCatCount, clearAllRequest, species } = useOiiaMode()
  const container = useRef<HTMLDivElement>(null)
  const engine = useRef<OiiaEngineHandle | null>(null)
  const isActive = useRef(false)
  const clearing = useRef(false)
  const clearingEngine = useRef<OiiaEngineHandle | null>(null)
  const cancelled = useRef(false)
  const speciesRef = useRef(species)

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally re-runs on mode change to reset the cancellation flag for the next activation
  useEffect(() => {
    cancelled.current = false
    return () => {
      cancelled.current = true
      clearing.current = false
      clearingEngine.current?.destroy()
      clearingEngine.current = null
    }
  }, [mode])

  useEffect(() => {
    isActive.current = mode === 'oiia'
  }, [mode])

  useEffect(() => {
    if (mode !== 'oiia') {
      return
    }

    const { body } = document
    const previousUserSelect = body.style.userSelect

    body.style.userSelect = 'none'

    return () => {
      body.style.userSelect = previousUserSelect
    }
  }, [mode])

  useEffect(() => {
    if (mode !== 'oiia' || !container.current) {
      return
    }
    const el = container.current
    let mountCancelled = false

    import('matter-js').then((M) => {
      if (mountCancelled) {
        return
      }
      engine.current = createOiiaEngine(M, el, setCatCount, speciesRef.current)
    })

    return () => {
      mountCancelled = true
      engine.current?.destroy()
      engine.current = null
    }
  }, [mode, setCatCount])

  useEffect(() => {
    speciesRef.current = species
    engine.current?.setSpecies(species)
  }, [species])

  useEffect(() => {
    if (clearAllRequest === 0 || clearing.current || !engine.current) {
      return
    }
    const e = engine.current
    engine.current = null
    clearing.current = true
    clearingEngine.current = e

    e.clear(() => {
      clearing.current = false
      if (clearingEngine.current === e) {
        clearingEngine.current = null
      }
      if (cancelled.current || !(isActive.current && container.current)) {
        return
      }
      import('matter-js').then((M) => {
        if (cancelled.current || !(isActive.current && container.current)) {
          return
        }
        engine.current = createOiiaEngine(
          M,
          container.current,
          setCatCount,
          speciesRef.current
        )
      })
    })
  }, [clearAllRequest, setCatCount])

  return (
    <div
      aria-hidden='true'
      className='pointer-events-none fixed inset-0 z-[9998]'
      ref={container}
    />
  )
}
