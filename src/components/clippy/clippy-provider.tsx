'use client'

import type { AgentType } from 'clippyts/dist/types'
import {
  type ReactNode,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import AGENTS from './agents'
import {
  ClippyContext,
  type ClippyContextValue,
  type ClippyInstance,
} from './clippy-context'
import { clippyReducer, initialClippyState } from './clippy-state'
import { useClippyController } from './use-clippy-controller'
import { useClippyElement } from './use-clippy-element'

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
  const [state, dispatch] = useReducer(clippyReducer, initialClippyState)
  const stateRef = useRef(state)
  stateRef.current = state

  const { elementRef, listenersRef, setElementRef } = useClippyElement({
    draggable,
  })
  const {
    hideAgent,
    showAgent,
    showMessage,
    playAnimation,
    cancelAnimation,
    moveTo,
    gestureAt,
  } = useClippyController({
    stateRef,
    elementRef,
    listenersRef,
    setElementRef,
    setClippyInstance,
    dispatch,
  })

  useEffect(() => {
    showAgent(agentName, true)
    return () => {
      hideAgent(true)
    }
  }, [agentName, showAgent, hideAgent])

  const value = useMemo<ClippyContextValue>(
    () => ({
      clippy: clippyInstance,
      currentAgent: state.currentAgent,
      isAgentVisible: state.isAgentVisible,
      isLoadingAgent: state.isLoadingAgent,
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
      state.currentAgent,
      state.isAgentVisible,
      state.isLoadingAgent,
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
