'use client'

import type { UseChatHelpers } from '@ai-sdk/react'
import { isToolUIPart } from 'ai'
import { useRef } from 'react'
import type { MyUIMessage } from '@/app/api/chat/types'
import { useOn } from '@/hooks/use-on'
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
  const lastTool = useRef<string | null>(null)

  useOn(open, () => {
    if (!agent) {
      return
    }
    agent.stop()
    if (open) {
      playAnimation(agent, animations.open)
      return
    }
    agent.play(animations.bye)
    agent.play(animations.show)
  })

  useOn(status, () => {
    if (!agent) {
      return
    }
    if (status === 'streaming') {
      agent.stopCurrent()
    }
    if (status === 'ready') {
      lastTool.current = null
    }
  })

  useOn(messages, () => {
    if (!agent || status !== 'streaming') {
      return
    }
    const toolPart = (messages.at(-1)?.parts ?? []).find(isToolUIPart)
    if (!toolPart || lastTool.current === toolPart.type) {
      return
    }
    lastTool.current = toolPart.type
    playAnimation(agent, animations.tool, { interrupt: true })
  })
}
