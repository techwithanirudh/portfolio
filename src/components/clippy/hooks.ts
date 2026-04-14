'use client'

import type { UseChatHelpers } from '@ai-sdk/react'
import { isToolUIPart } from 'ai'
import { type Dispatch, type SetStateAction, useEffect, useRef } from 'react'
import type { MyUIMessage } from '@/app/api/chat/types'
import { animations } from './constants'
import type { ClippyAgent } from './provider'
import { playAnimation, useJitteredInterval } from './utils'

const getPosition = () => ({
  x: window.innerWidth - 90,
  y: window.innerHeight - 100,
})

export const playSubmitAnimation = (agent: ClippyAgent | undefined) => {
  if (!agent) {
    return
  }
  playAnimation(agent, animations.submit, { interrupt: true })
}

export function useClippyTrigger({
  agent,
  setOpen,
}: {
  agent: ClippyAgent | undefined
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  useJitteredInterval(
    () => playAnimation(agent!, animations.idle),
    3000,
    4000,
    !!agent
  )

  useEffect(() => {
    if (!agent) {
      return
    }

    const { x, y } = getPosition()
    agent.show(true)
    agent.moveTo(x, y, 0)

    agent._el.style.visibility = 'hidden'
    requestAnimationFrame(() => {
      agent._el.style.visibility = 'visible'
    })

    const handleClick = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      setOpen((prev) => !prev)
    }

    const handleResize = () => {
      const { x, y } = getPosition()
      agent.moveTo(x, y, 0)
    }

    agent._el.addEventListener('click', handleClick)
    window.addEventListener('resize', handleResize)

    return () => {
      agent._el.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
    }
  }, [agent, setOpen])
}

export function useClippyPanel({
  agent,
  messages,
  open,
  status,
}: {
  agent: ClippyAgent | undefined
  messages: MyUIMessage[]
  open: boolean
  status: UseChatHelpers<MyUIMessage>['status']
}) {
  const lastOpen = useRef(open)
  const lastTool = useRef<string | null>(null)

  useEffect(() => {
    if (lastOpen.current === open || !agent) {
      return
    }

    lastOpen.current = open
    agent.stop()

    if (open) {
      playAnimation(agent, animations.open)
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

    if (status === 'ready') {
      if (lastMessage?.role === 'assistant') {
        agent.stopCurrent()
      }
      lastTool.current = null
      return
    }

    const toolPart = (lastMessage?.parts ?? []).find(isToolUIPart)
    if (!toolPart || lastTool.current === toolPart.type) {
      return
    }

    lastTool.current = toolPart.type
    playAnimation(agent, animations.tool, { interrupt: true })
  }, [agent, messages, status])
}
