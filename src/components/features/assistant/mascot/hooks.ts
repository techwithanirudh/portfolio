'use client'

import type { UseChatHelpers } from '@ai-sdk/react'
import { isToolUIPart } from 'ai'
import { useOn } from '@/hooks/use-on'
import type { MyUIMessage } from '@/lib/ai/chat/types'
import { type AnimationName, animations } from './constants'
import { pick, type SimbaController } from './controller'

type ChatStatus = UseChatHelpers<MyUIMessage>['status']

// What Simba acts out while he works on a reply
const activityFor = (
  status: ChatStatus,
  messages: MyUIMessage[]
): AnimationName | null => {
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

// Reacts the moment a message is sent, before the chat status catches up
export const playSubmitAnimation = (mascot: SimbaController | undefined) => {
  mascot?.setActivity(animations.submit)
}

export function useMascotPanel({
  mascot,
  messages,
  open,
  status,
}: {
  mascot: SimbaController | undefined
  messages: MyUIMessage[]
  open: boolean
  status: ChatStatus
}) {
  useOn(open, () => {
    if (!mascot) {
      return
    }
    if (open) {
      mascot.play(pick(animations.open), { interrupt: true })
      return
    }
    mascot.stop()
    mascot.play(animations.bye)
    mascot.play(animations.show)
  })

  const activity = activityFor(status, messages)

  useOn(activity, () => {
    mascot?.setActivity(activity)
  })
}
