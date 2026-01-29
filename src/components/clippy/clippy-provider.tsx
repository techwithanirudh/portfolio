'use client'

import clippyts, { type Agent } from 'clippyts'
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
  const [isLoading, setIsLoading] = useState(false)
  const instance = useRef<Agent | null>(null)

  useEffect(() => {
    setIsLoading(true)

    clippyts.load({
      name: agentName,
      successCb: (agent) => {
        instance.current = agent
        setClippy(agent)
        setIsLoading(false)
      },
      failCb: (error) => {
        console.error('Failed to load Clippy:', error)
        setClippy(undefined)
        setIsLoading(false)
      },
    })

    return () => {
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
    () => ({ clippy, element, agentName, isLoading }),
    [clippy, element, agentName, isLoading]
  )

  return (
    <ClippyContext.Provider value={value}>{children}</ClippyContext.Provider>
  )
}
