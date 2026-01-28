'use client'

import clippyts, { type Agent } from 'clippyts'
import type { AgentType } from 'clippyts/dist/types'
import { type ReactNode, useCallback, useEffect, useState } from 'react'
import AGENTS from './agents'
import { ClippyContext } from './clippy-context'
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
  const [clippy, setClippy] = useState<Agent>()
  const [debugText, setDebugText] = useState('clippy: loading')

  const hideAgent = useCallback((agent: Agent | undefined, cb?: () => void) => {
    if (!agent) {
      cb?.()
      return
    }

    agent.hide(false, () => {
      cb?.()
    })
  }, [])

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
    return () => {
      hideAgent(clippy)
    }
  }, [clippy, hideAgent])

  useEffect(() => {
    let cancelled = false

    async function getAgent() {
      if (sharedAgent) {
        sharedAgent.show(false)
        setClippy(sharedAgent)
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

      try {
        const agent = await sharedLoading
        if (cancelled) {
          return
        }
        sharedAgent = agent
        agent.show(true)
        setClippy(agent)
      } catch (error) {
        console.error('Failed to load Clippy:', error)
        if (!cancelled) {
          setClippy(undefined)
        }
        sharedAgent = null
        sharedLoading = null
      }
    }

    getAgent()

    return () => {
      cancelled = true
    }
  }, [agentName])

  useEffect(() => {
    if (!clippy) {
      setDebugText('clippy: loading')
      return
    }

    const interval = window.setInterval(() => {
      const element = document.querySelector('.clippy') as HTMLElement | null
      const hidden = element?.hasAttribute('hidden') ? 'yes' : 'no'
      const display = element ? window.getComputedStyle(element).display : 'n/a'
      const top = element?.style.top ?? 'n/a'
      const left = element?.style.left ?? 'n/a'
      const internal = clippy as unknown as {
        _animator?: { currentAnimationName?: string }
      }
      const currentAnimation =
        internal._animator?.currentAnimationName ?? 'none'

      setDebugText(
        `clippy: loaded\ncurrent: ${currentAnimation}\nhidden: ${hidden}\ndisplay: ${display}\nposition: ${left}, ${top}\nanimations: ${clippy.animations().length}`
      )
    }, 500)

    return () => {
      window.clearInterval(interval)
    }
  }, [clippy])

  return (
    <ClippyContext.Provider value={{ clippy }}>
      {children}
      <div
        style={{
          position: 'fixed',
          right: 12,
          bottom: 12,
          zIndex: 9999,
          maxWidth: 320,
          padding: 10,
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas',
          fontSize: 12,
          borderRadius: 8,
          pointerEvents: 'none',
          whiteSpace: 'pre-wrap',
        }}
      >
        {debugText}
      </div>
    </ClippyContext.Provider>
  )
}
