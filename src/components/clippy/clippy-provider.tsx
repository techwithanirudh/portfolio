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
  type ClippyContextValue,
  type ClippyEventHandler,
  type ClippyInstance,
} from './clippy-context'
import { registerListener, syncListeners, unregisterListener } from './events'

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
  const [clippyInstance, setClippyInstance] = useState<
    ClippyInstance | undefined
  >()
  const [currentAgent, setCurrentAgent] = useState<AgentType | null>(null)
  const [isAgentVisible, setIsAgentVisible] = useState(false)
  const [isLoadingAgent, setIsLoadingAgent] = useState(false)

  const agentRef = useRef<Agent | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)
  const elementCleanupRef = useRef<(() => void) | null>(null)
  const listenersRef = useRef(
    new Map<string, Map<ClippyEventHandler, EventListener>>()
  )
  const loadingRef = useRef(false)
  const visibleRef = useRef(false)
  const currentAgentRef = useRef<AgentType | null>(null)

  useEffect(() => {
    visibleRef.current = isAgentVisible
  }, [isAgentVisible])

  useEffect(() => {
    currentAgentRef.current = currentAgent
  }, [currentAgent])

  const setElementRef = useCallback(() => {
    elementCleanupRef.current?.()
    elementCleanupRef.current = null
    elementRef.current = document.querySelector('.clippy') as HTMLElement | null
    syncListeners(listenersRef.current, elementRef.current)

    if (!draggable && elementRef.current) {
      const blockDrag = (event: MouseEvent) => {
        event.stopImmediatePropagation()
      }

      elementRef.current.addEventListener('mousedown', blockDrag, true)
      elementCleanupRef.current = () => {
        elementRef.current?.removeEventListener('mousedown', blockDrag, true)
      }
      return () => undefined
    }

    return () => undefined
  }, [draggable])

  const hideAgent = useCallback((fast = false, cb?: () => void) => {
    const agent = agentRef.current
    if (!agent) {
      cb?.()
      return
    }

    agent.hide(fast, () => {
      agentRef.current = null
      setClippyInstance(undefined)
      setCurrentAgent(null)
      setIsAgentVisible(false)
      visibleRef.current = false
      cb?.()
    })
  }, [])

  const on = useCallback((eventName: string, handler: ClippyEventHandler) => {
    registerListener(
      listenersRef.current,
      elementRef.current,
      agentRef,
      eventName,
      handler
    )
  }, [])

  const off = useCallback((eventName: string, handler: ClippyEventHandler) => {
    unregisterListener(
      listenersRef.current,
      elementRef.current,
      eventName,
      handler
    )
  }, [])

  const loadAgent = useCallback(
    (name: AgentType, fast = true) => {
      if (loadingRef.current) {
        return
      }

      loadingRef.current = true
      setIsLoadingAgent(true)

      clippyts.load({
        name,
        successCb: (agent) => {
          loadingRef.current = false
          setIsLoadingAgent(false)

          agent.show(fast)
          agentRef.current = agent
          setClippyInstance(Object.assign(agent, { on, off }))
          setCurrentAgent(name)
          setIsAgentVisible(true)
          visibleRef.current = true

          setElementRef()
        },
        failCb: (error) => {
          console.error('Failed to load Clippy:', error)
          loadingRef.current = false
          setIsLoadingAgent(false)
          agentRef.current = null
          setCurrentAgent(null)
          setIsAgentVisible(false)
          visibleRef.current = false
        },
      })
    },
    [off, on, setElementRef]
  )

  const showAgent = useCallback(
    (name: AgentType, fast = true) => {
      if (!Object.values(AGENTS).includes(name)) {
        console.warn('ClippyProvider: invalid agent name', name)
        return
      }

      if (loadingRef.current) {
        return
      }

      if (currentAgentRef.current === name && visibleRef.current) {
        return
      }

      if (agentRef.current) {
        hideAgent(false, () => loadAgent(name, fast))
        return
      }

      loadAgent(name, fast)
    },
    [hideAgent, loadAgent]
  )

  const showMessage = useCallback((message: string, timeoutMs?: number) => {
    const agent = agentRef.current
    if (!agent) {
      return
    }

    agent.speak(message, true)

    if (timeoutMs && timeoutMs > 0) {
      window.setTimeout(() => {
        agentRef.current?.closeBalloon()
      }, timeoutMs)
    }
  }, [])

  const playAnimation = useCallback((animationName?: string) => {
    const agent = agentRef.current
    if (!agent) {
      return
    }

    agent.stopCurrent()
    agent.stop()

    if (animationName) {
      agent.play(animationName)
      return
    }

    agent.animate()
  }, [])

  const cancelAnimation = useCallback(() => {
    const agent = agentRef.current
    if (!agent) {
      return
    }

    agent.stopCurrent()
    agent.stop()
  }, [])

  const moveTo = useCallback((x: number, y: number, durationMs = 1000) => {
    agentRef.current?.moveTo(x, y, durationMs)
  }, [])

  const gestureAt = useCallback((x: number, y: number) => {
    agentRef.current?.gestureAt(x, y)
  }, [])

  useEffect(() => {
    showAgent(agentName, true)
    return () => {
      hideAgent(true)
    }
  }, [agentName, showAgent, hideAgent])

  const value = useMemo<ClippyContextValue>(
    () => ({
      clippy: clippyInstance,
      currentAgent,
      isAgentVisible,
      isLoadingAgent,
      showAgent,
      hideAgent,
      showMessage,
      playAnimation,
      cancelAnimation,
      moveTo,
      gestureAt,
    }),
    [
      clippyInstance,
      currentAgent,
      isAgentVisible,
      isLoadingAgent,
      showAgent,
      hideAgent,
      showMessage,
      playAnimation,
      cancelAnimation,
      moveTo,
      gestureAt,
    ]
  )

  return (
    <ClippyContext.Provider value={value}>{children}</ClippyContext.Provider>
  )
}
