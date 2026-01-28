'use client'

import clippyts, { type Agent } from 'clippyts'
import type { AgentType } from 'clippyts/dist/types'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import AGENTS from './agents'
import {
  ClippyContext,
  type ClippyEventHandler,
  type ClippyInstance,
} from './clippy-context'
import clippyStyle from './style'

let sharedAgent: Agent | null = null
let sharedLoading: Promise<Agent> | null = null
let sharedUsers = 0
let disposeTimer: number | null = null

interface ClippyProviderProps {
  children?: ReactNode
  agentName?: AgentType
}

export function ClippyProvider({
  children,
  agentName = AGENTS.CLIPPY,
}: ClippyProviderProps) {
  const [clippy, setClippy] = useState<ClippyInstance>()
  const clippyRef = useRef<ClippyInstance | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)
  const listenersRef = useRef<
    Map<string, Map<ClippyEventHandler, EventListener>>
  >(new Map())

  useEffect(() => {
    clippyRef.current = clippy ?? null
  }, [clippy])

  const hideAgent = useCallback((agent: Agent | undefined, cb?: () => void) => {
    if (!agent) {
      cb?.()
      return
    }

    agent.hide(false, () => {
      cb?.()
    })
  }, [])

  const attachListener = useCallback(
    (eventName: string, handler: ClippyEventHandler) => {
      let eventMap = listenersRef.current.get(eventName)
      if (!eventMap) {
        eventMap = new Map()
        listenersRef.current.set(eventName, eventMap)
      }

      if (eventMap.has(handler)) {
        return
      }

      const wrapped: EventListener = (event) => {
        const current = clippyRef.current
        if (!current) {
          return
        }
        handler(event, current)
      }

      eventMap.set(handler, wrapped)
      document.addEventListener(eventName, wrapped, true)
    },
    []
  )

  const detachListener = useCallback(
    (eventName: string, handler: ClippyEventHandler) => {
      const eventMap = listenersRef.current.get(eventName)
      if (!eventMap) {
        return
      }

      const wrapped = eventMap.get(handler)
      if (!wrapped) {
        return
      }

      document.removeEventListener(eventName, wrapped, true)
      eventMap.delete(handler)
      if (eventMap.size === 0) {
        listenersRef.current.delete(eventName)
      }
    },
    []
  )

  useEffect(() => {
    sharedUsers += 1
    if (disposeTimer) {
      window.clearTimeout(disposeTimer)
      disposeTimer = null
    }

    const styleEl = document.createElement('style')
    styleEl.dataset.clippy = 'true'
    styleEl.appendChild(document.createTextNode(clippyStyle))
    document.head.appendChild(styleEl)

    return () => {
      styleEl.remove()
      sharedUsers = Math.max(0, sharedUsers - 1)
      if (sharedUsers === 0) {
        disposeTimer = window.setTimeout(() => {
          if (sharedUsers === 0 && sharedAgent) {
            hideAgent(sharedAgent)
            sharedAgent = null
            sharedLoading = null
          }
          disposeTimer = null
        }, 200)
      }
    }
  }, [hideAgent])

  useEffect(() => {
    function loadAgent() {
      if (sharedAgent) {
        sharedAgent.show(true)
        const el = document.querySelector('.clippy') as HTMLElement | null
        elementRef.current = el

        const instance = Object.assign(sharedAgent, {
          on: (eventName: string, handler: ClippyEventHandler) => {
            attachListener(eventName, handler)
          },
          off: (eventName: string, handler: ClippyEventHandler) => {
            detachListener(eventName, handler)
          },
        }) as ClippyInstance

        setClippy(instance)
        return
      }

      if (!sharedLoading) {
        sharedLoading = new Promise((resolve, reject) => {
          clippyts.load({
            name: agentName,
            successCb: (agent) => resolve(agent),
            failCb: (error) => reject(error),
          })
        })
      }

      const loading = sharedLoading
      if (!loading) {
        return
      }

      loading
        .then((agent) => {
          sharedAgent = agent
          agent.show(true)
          const el = document.querySelector('.clippy') as HTMLElement | null
          elementRef.current = el

          const instance = Object.assign(agent, {
            on: (eventName: string, handler: ClippyEventHandler) => {
              attachListener(eventName, handler)
            },
            off: (eventName: string, handler: ClippyEventHandler) => {
              detachListener(eventName, handler)
            },
          }) as ClippyInstance

          setClippy(instance)

          if (el) {
            for (const [eventName, handlers] of listenersRef.current) {
              for (const [handler] of handlers) {
                attachListener(eventName, handler)
              }
            }
          }
        })
        .catch((error) => {
          console.error('Failed to load Clippy:', error)
          setClippy(undefined)
          sharedAgent = null
          sharedLoading = null
        })
    }

    if (clippy) {
      hideAgent(clippy, () => loadAgent())
    } else {
      loadAgent()
    }
  }, [agentName, attachListener, detachListener, clippy, hideAgent])

  useEffect(() => {
    return () => {
      hideAgent(clippy)
    }
  }, [clippy, hideAgent])

  const value = useMemo(() => ({ clippy }), [clippy])

  return (
    <ClippyContext.Provider value={value}>{children}</ClippyContext.Provider>
  )
}
