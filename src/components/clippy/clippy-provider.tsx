'use client'

import 'clippyts/src/clippy.css'
import type { Agent } from 'clippyts'
import type { AgentType } from 'clippyts/dist/types'
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import AGENTS from './agents'
import { ClippyContext, type ClippyContextValue } from './clippy-context'

interface ClippyProviderProps {
  children?: ReactNode
  agentName?: AgentType
  draggable?: boolean
}

export function ClippyProvider({
  children,
  agentName = AGENTS.CLIPPY,
  draggable = false,
}: ClippyProviderProps) {
  const [clippy, setClippy] = useState<Agent | undefined>()
  const [element, setElement] = useState<HTMLElement | null>(null)
  const instance = useRef<Agent | null>(null)

  useEffect(() => {
    let cancelled = false

    import('clippyts').then(({ default: clippyts }) => {
      if (cancelled) {
        return
      }

      clippyts.load({
        name: agentName,
        successCb: (agent) => {
          if (cancelled) {
            return
          }
          instance.current = agent
          setClippy(agent)
        },
        failCb: (error) => {
          console.error('Failed to load Clippy:', error)
        },
      })
    })

    return () => {
      cancelled = true
      instance.current?.hide(false, () => {
        instance.current = null
      })
    }
  }, [agentName])

  useEffect(() => {
    if (!clippy) {
      setElement(null)
      return
    }

    const el = document.querySelector('.clippy') as HTMLElement | null
    setElement(el)

    if (!el || draggable) {
      return
    }

    const blockDrag = (event: MouseEvent) => {
      event.stopImmediatePropagation()
    }

    el.addEventListener('mousedown', blockDrag, true)
    return () => el.removeEventListener('mousedown', blockDrag, true)
  }, [clippy, draggable])

  const value = useMemo<ClippyContextValue>(
    () => ({ clippy, element, agentName }),
    [clippy, element, agentName]
  )

  return (
    <ClippyContext.Provider value={value}>{children}</ClippyContext.Provider>
  )
}
