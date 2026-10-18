'use client'

import { type ChatStatus, isToolUIPart } from 'ai'
import { useOn } from '@/hooks/use-on'
import type { MyUIMessage } from '@/lib/ai/chat/types'
import { type AnimationName, animations } from './constants'
import { pick, type SimbaController } from './controller'

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
