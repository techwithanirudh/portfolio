'use client'

import clippyts, { type Agent } from 'clippyts'
import type { AgentType } from 'clippyts/dist/types'
import { useRef } from 'react'
import { useEvent } from '@/hooks/use-event'
import AGENTS from './agents'
import type { ClippyEventHandler, ClippyInstance } from './clippy-context'
import type { ClippyAction, ClippyState } from './clippy-state'
import { registerListener, unregisterListener } from './events'

interface UseClippyControllerOptions {
  stateRef: React.MutableRefObject<ClippyState>
  elementRef: React.MutableRefObject<HTMLElement | null>
  listenersRef: React.MutableRefObject<
    Map<string, Map<ClippyEventHandler, EventListener>>
  >
  setElementRef: () => void
  setClippyInstance: (value: ClippyInstance | undefined) => void
  dispatch: React.Dispatch<ClippyAction>
}

export const useClippyController = ({
  stateRef,
  elementRef,
  listenersRef,
  setElementRef,
  setClippyInstance,
  dispatch,
}: UseClippyControllerOptions) => {
  const agentRef = useRef<Agent | null>(null)

  const hideAgent = useEvent((fast = false, cb?: () => void) => {
    const agent = agentRef.current
    if (!agent) {
      cb?.()
      return
    }

    agent.hide(fast, () => {
      agentRef.current = null
      setClippyInstance(undefined)
      dispatch({ type: 'hidden' })
      cb?.()
    })
  })

  const on = useEvent((eventName: string, handler: ClippyEventHandler) => {
    registerListener(
      listenersRef.current,
      elementRef.current,
      agentRef,
      eventName,
      handler
    )
  })

  const off = useEvent((eventName: string, handler: ClippyEventHandler) => {
    unregisterListener(
      listenersRef.current,
      elementRef.current,
      eventName,
      handler
    )
  })

  const loadAgent = useEvent((name: AgentType, fast = true) => {
    if (stateRef.current.isLoadingAgent) {
      return
    }

    dispatch({ type: 'loading' })

    clippyts.load({
      name,
      successCb: (agent) => {
        dispatch({ type: 'loaded', agentName: name })

        agent.show(fast)
        agentRef.current = agent
        setClippyInstance(Object.assign(agent, { on, off }))

        setElementRef()
      },
      failCb: (error) => {
        console.error('Failed to load Clippy:', error)
        agentRef.current = null
        dispatch({ type: 'failed' })
      },
    })
  })

  const showAgent = useEvent((name: AgentType, fast = true) => {
    if (!Object.values(AGENTS).includes(name)) {
      console.warn('ClippyProvider: invalid agent name', name)
      return
    }

    if (stateRef.current.isLoadingAgent) {
      return
    }

    if (
      stateRef.current.currentAgent === name &&
      stateRef.current.isAgentVisible
    ) {
      return
    }

    if (agentRef.current) {
      hideAgent(false, () => loadAgent(name, fast))
      return
    }

    loadAgent(name, fast)
  })

  const showMessage = useEvent((message: string, timeoutMs?: number) => {
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
  })

  const playAnimation = useEvent((animationName?: string) => {
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
  })

  const cancelAnimation = useEvent(() => {
    const agent = agentRef.current
    if (!agent) {
      return
    }

    agent.stopCurrent()
    agent.stop()
  })

  const moveTo = useEvent((x: number, y: number, durationMs = 1000) => {
    agentRef.current?.moveTo(x, y, durationMs)
  })

  const gestureAt = useEvent((x: number, y: number) => {
    agentRef.current?.gestureAt(x, y)
  })

  return {
    hideAgent,
    showAgent,
    showMessage,
    playAnimation,
    cancelAnimation,
    moveTo,
    gestureAt,
  }
}
