'use client'

import type { UseChatHelpers } from '@ai-sdk/react'
import { isToolUIPart } from 'ai'
import { useEffect, useRef } from 'react'
import type { MyUIMessage } from '@/app/api/chat/types'
import { useOn } from '@/hooks/use-on'
import { animations, moodAnimations } from './constants'
import { type MascotAgent, useMascot } from './provider'
import { playAnimation } from './utils'

export const playSubmitAnimation = (agent: MascotAgent | undefined) => {
  if (!agent) {
    return
  }
  playAnimation(agent, animations.submit, { interrupt: true })
}

export function useMascotPanel({
  agent,
  messages,
  open,
  status,
}: {
  agent: MascotAgent | undefined
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
    if (
      !toolPart ||
      toolPart.type === 'tool-animate' ||
      lastTool.current === toolPart.type
    ) {
      return
    }
    lastTool.current = toolPart.type
    playAnimation(agent, animations.tool, { interrupt: true })
  })
}

export function useMascotTools(messages: MyUIMessage[]) {
  const { agent } = useMascot()
  const handled = useRef(new Set<string>())

  useEffect(() => {
    if (!agent) {
      return
    }
    const part = (messages.at(-1)?.parts ?? []).find(
      (item) => item.type === 'tool-animate'
    )
    if (part?.state !== 'output-available') {
      return
    }
    if (handled.current.has(part.toolCallId)) {
      return
    }
    handled.current.add(part.toolCallId)

    const mood = part.input?.mood
    if (mood) {
      playAnimation(agent, moodAnimations[mood], { interrupt: true })
    }
  }, [messages, agent])
}
