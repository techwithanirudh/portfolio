'use client'

import type { UseChatHelpers } from '@ai-sdk/react'
import { isToolUIPart } from 'ai'
import type { MyUIMessage } from '@/app/api/chat/types'
import { useOn } from '@/hooks/use-on'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { animations } from './constants'
import type { MascotAgent } from './provider'
import { playAnimation } from './utils'

// What the dog acts out while Simba works; the trigger loops it until cleared
export const mascotActivity: { current: string | null } = { current: null }

type ChatStatus = UseChatHelpers<MyUIMessage>['status']

const activityFor = (
  status: ChatStatus,
  messages: MyUIMessage[]
): string | null => {
  if (status === 'submitted') {
    return animations.submit
  }
  if (status !== 'streaming') {
    return null
  }
  const lastPart = messages.at(-1)?.parts.at(-1)
  if (!lastPart || lastPart.type === 'reasoning') {
    return animations.thinking
  }
  if (isToolUIPart(lastPart)) {
    return animations.tool
  }
  return animations.writing
}

export const playSubmitAnimation = (agent: MascotAgent | undefined) => {
  if (!agent || prefersReducedMotion()) {
    return
  }
  mascotActivity.current = animations.submit
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
  status: ChatStatus
}) {
  useOn(open, () => {
    if (!agent) {
      return
    }
    agent.stop()
    if (prefersReducedMotion()) {
      agent.play(animations.rest)
      return
    }
    if (open) {
      playAnimation(agent, animations.open)
      return
    }
    agent.play(animations.bye)
    agent.play(animations.show)
  })

  const activity = activityFor(status, messages)

  useOn(activity, () => {
    mascotActivity.current = prefersReducedMotion() ? null : activity
    if (agent && mascotActivity.current) {
      playAnimation(agent, mascotActivity.current, { interrupt: true })
    }
  })
}
