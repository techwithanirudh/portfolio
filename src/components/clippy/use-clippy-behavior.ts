'use client'

import { useEffect, useRef } from 'react'
import type { MyUIMessage } from '@/app/api/chat/types'
import { animations, idleExclude, openAnimations } from './animations'
import type { ClippyAgent } from './clippy-provider'

const IDLE_MIN_MS = 3000
const IDLE_JITTER_MS = 4000

const getPosition = () => ({
  x: window.innerWidth - 90,
  y: window.innerHeight - 100,
})

const getRandomItem = <T>(items: readonly T[]) =>
  items[Math.floor(Math.random() * items.length)]

const getIdlePool = (agent: ClippyAgent) =>
  agent
    .animations()
    .filter((animation: string) => !idleExclude.has(animation))
    .filter((animation: string) => !animation.startsWith('Idle'))

export const playSubmitAnimation = (agent: ClippyAgent | undefined) => {
  if (!agent) {
    return
  }

  agent.stop()
  agent.play(animations.submit)
}

export function useClippyTriggerBehavior({
  agent,
  open,
  setOpen,
}: {
  agent: ClippyAgent | undefined
  open: boolean
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void
}) {
  useEffect(() => {
    if (!agent) {
      return
    }

    const reposition = () => {
      const { x, y } = getPosition()
      agent.moveTo(x, y, 0)
    }

    agent.show(true)
    reposition()

    agent._el.style.visibility = 'hidden'
    requestAnimationFrame(() => {
      agent._el.style.visibility = 'visible'
    })

    const idlePool = getIdlePool(agent)

    const handleClick = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      setOpen((currentOpen) => !currentOpen)
    }

    const handleResize = () => {
      window.requestAnimationFrame(reposition)
    }

    agent._el.addEventListener('click', handleClick)
    window.addEventListener('resize', handleResize)

    let idleTimer = 0
    const scheduleIdle = () => {
      idleTimer = window.setTimeout(
        () => {
          const idleAnimation = getRandomItem(idlePool)
          if (idleAnimation) {
            agent.play(idleAnimation)
          }
          scheduleIdle()
        },
        IDLE_MIN_MS + Math.random() * IDLE_JITTER_MS
      )
    }
    scheduleIdle()

    return () => {
      agent._el.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
      window.clearTimeout(idleTimer)
    }
  }, [agent, setOpen])

  useEffect(() => {
    if (!(agent && open)) {
      return
    }

    const { x, y } = getPosition()
    agent.moveTo(x, y, 0)
  }, [agent, open])
}

export function useClippyPanelBehavior({
  agent,
  messages,
  open,
  status,
}: {
  agent: ClippyAgent | undefined
  messages: MyUIMessage[]
  open: boolean
  status: string
}) {
  const lastOpen = useRef(open)
  const lastTool = useRef<string | null>(null)

  useEffect(() => {
    if (status !== 'ready' || !agent) {
      return
    }

    const lastMessage = messages.at(-1)
    if (lastMessage?.role === 'assistant') {
      agent.stopCurrent()
    }
  }, [agent, messages, status])

  useEffect(() => {
    if (lastOpen.current === open || !agent) {
      return
    }

    lastOpen.current = open
    agent.stop()

    if (open) {
      const openAnimation = getRandomItem(openAnimations)
      if (openAnimation) {
        agent.play(openAnimation)
      }
      return
    }

    agent.play(animations.bye)
    agent.play(animations.show)
  }, [agent, open])

  useEffect(() => {
    if (!agent) {
      return
    }

    const lastMessage = messages.at(-1)
    const parts = lastMessage?.parts ?? []
    const toolPart = parts.find((part) => part.type.startsWith('tool-'))

    if (!toolPart || status === 'ready') {
      lastTool.current = null
      return
    }

    if (lastTool.current === toolPart.type) {
      return
    }

    lastTool.current = toolPart.type
    agent.stop()
    agent.play(animations.tool)
  }, [agent, messages, status])
}
