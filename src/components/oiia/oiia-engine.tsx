'use client'

import { useEffect, useRef } from 'react'
import { createOiiaEngine, type OiiaEngine } from './oiia-physics'
import { useOiiaMode } from './oiia-provider'

export function OiiaEngine() {
  const { mode, setCatCount, clearAllRequest } = useOiiaMode()
  const container = useRef<HTMLDivElement>(null)
  const engine = useRef<OiiaEngine | null>(null)
  const isActive = useRef(false)

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
    let cancelled = false

    import('matter-js').then((M) => {
      if (cancelled) {
        return
      }
      engine.current = createOiiaEngine(M, el, setCatCount)
    })

    return () => {
      cancelled = true
      engine.current?.destroy()
      engine.current = null
    }
  }, [mode, setCatCount])

  useEffect(() => {
    if (clearAllRequest === 0 || !engine.current) {
      return
    }
    const e = engine.current
    engine.current = null

    e.clear(() => {
      if (!(isActive.current && container.current)) {
        return
      }
      import('matter-js').then((M) => {
        if (!(isActive.current && container.current)) {
          return
        }
        engine.current = createOiiaEngine(M, container.current, setCatCount)
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
