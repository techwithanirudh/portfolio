'use client'

import type { Agent } from 'clippyts'
import type { AgentType } from 'clippyts/dist/types'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ClippyContext } from './clippy-context'

const AGENTS = {
  BONZI: 'Bonzi',
  CLIPPY: 'Clippy',
  F1: 'F1',
  GENIE: 'Genie',
  GENIUS: 'Genius',
  LINKS: 'Links',
  MERLIN: 'Merlin',
  PEEDY: 'Peedy',
  ROCKY: 'Rocky',
  ROVER: 'Rover',
} as const

interface ClippyProviderProps {
  children: ReactNode
  agentName?: AgentType
  selector?: string
  draggable?: boolean
  onClick?: () => void
  onDoubleClick?: () => void
  initialPosition?: { x: number; y: number }
  resetPositionOnResize?: boolean
}

export function ClippyProvider({
  children,
  agentName = AGENTS.ROVER,
  selector = 'clippy-container',
  draggable = false,
  onClick,
  onDoubleClick,
  initialPosition,
  resetPositionOnResize = true,
}: ClippyProviderProps) {
  const [agent, setAgent] = useState<Agent | undefined>()
  const [isLoaded, setIsLoaded] = useState(false)
  const agentRef = useRef<Agent | null>(null)

  const getPosition = useCallback(() => {
    return (
      initialPosition ?? {
        x: window.innerWidth - 90,
        y: window.innerHeight - 100,
      }
    )
  }, [initialPosition])

  useEffect(() => {
    let mounted = true
    const cleanupFns: (() => void)[] = []

    async function loadClippy() {
      const clippy = (await import('clippyts')).default

      clippy.load({
        name: agentName,
        selector,
        successCb: (loadedAgent) => {
          if (!mounted) {
            loadedAgent.hide(true, () => undefined)
            return
          }

          agentRef.current = loadedAgent
          setAgent(loadedAgent)
          setIsLoaded(true)

          loadedAgent.show(true)
          const { x, y } = getPosition()
          loadedAgent.moveTo(x, y, 0)

          const el = document.querySelector(`.${selector}`)

          if (onClick) {
            const handleClick = (e: Event) => {
              e.preventDefault()
              e.stopPropagation()
              onClick()
            }
            el?.addEventListener('click', handleClick)
            cleanupFns.push(() => el?.removeEventListener('click', handleClick))
          }

          if (onDoubleClick) {
            const handleDblClick = (e: Event) => {
              e.preventDefault()
              e.stopPropagation()
              onDoubleClick()
            }
            el?.addEventListener('dblclick', handleDblClick)
            cleanupFns.push(() =>
              el?.removeEventListener('dblclick', handleDblClick)
            )
          }

          if (!draggable) {
            for (const clippyEl of document.querySelectorAll('.clippy')) {
              const blockDrag = (e: Event) => e.stopImmediatePropagation()
              clippyEl.addEventListener('mousedown', blockDrag, true)
              cleanupFns.push(() =>
                clippyEl.removeEventListener('mousedown', blockDrag, true)
              )
            }
          }

          if (resetPositionOnResize) {
            const handleResize = () => {
              const { x, y } = getPosition()
              loadedAgent.moveTo(x, y, 0)
            }
            window.addEventListener('resize', handleResize)
            cleanupFns.push(() =>
              window.removeEventListener('resize', handleResize)
            )
          }
        },
        failCb: (err) => {
          console.error('Failed to load Clippy:', err)
          setIsLoaded(false)
        },
      })
    }

    loadClippy()

    return () => {
      mounted = false
      for (const cleanup of cleanupFns) {
        cleanup()
      }
      agentRef.current?.hide(true, () => undefined)
    }
  }, [
    agentName,
    selector,
    draggable,
    onClick,
    onDoubleClick,
    getPosition,
    resetPositionOnResize,
  ])

  const value = useMemo(() => ({ agent, isLoaded }), [agent, isLoaded])

  return (
    <>
      <div className={selector} />
      <ClippyContext value={value}>{children}</ClippyContext>
    </>
  )
}

export { AGENTS }
