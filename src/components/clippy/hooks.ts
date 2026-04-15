'use client'

import type { UseChatHelpers } from '@ai-sdk/react'
import { isToolUIPart } from 'ai'
import { useEffect, useRef } from 'react'
import type { MyUIMessage } from '@/app/api/chat/types'
import { animations } from './constants'
import type { ClippyAgent } from './provider'
import { playAnimation } from './utils'

export const playSubmitAnimation = (agent: ClippyAgent | undefined) => {
  if (!agent) {
    return
  }
  playAnimation(agent, animations.submit, { interrupt: true })
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
    if (agent && status === 'streaming') {
      agent.stopCurrent()
    }
  }, [agent, status])

  useEffect(() => {
    if (!agent || status !== 'streaming') {
      return
    }

    const toolPart = (messages.at(-1)?.parts ?? []).find(isToolUIPart)
    if (!toolPart || lastTool.current === toolPart.type) {
      return
    }

    lastTool.current = toolPart.type
    playAnimation(agent, animations.tool, { interrupt: true })
  }, [agent, messages, status])

  useEffect(() => {
    if (!agent || status !== 'ready') {
      return
    }
    lastTool.current = null
  }, [agent, status])
}
