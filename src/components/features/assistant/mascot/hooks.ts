'use client'

import type { UseChatHelpers } from '@ai-sdk/react'
import { isToolUIPart } from 'ai'
import { useRef } from 'react'
import type { MyUIMessage } from '@/app/api/chat/types'
import { useOn } from '@/hooks/use-on'
import { animations } from './constants'
import type { SimbaController } from './controller'

export const playSubmitAnimation = (mascot: SimbaController | undefined) => {
  mascot?.play(animations.submit, { interrupt: true })
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
  status: UseChatHelpers<MyUIMessage>['status']
}) {
  const lastTool = useRef<string | null>(null)

  useOn(open, () => {
    if (!mascot) {
      return
    }
    if (open) {
      mascot.play(pickOpen(), { interrupt: true })
      return
    }
    mascot.stop()
    mascot.play(animations.bye)
    mascot.play(animations.show)
  })

  useOn(status, () => {
    if (!mascot) {
      return
    }
    if (status === 'streaming') {
      mascot.stopCurrent()
    }
    if (status === 'ready') {
      lastTool.current = null
    }
  })

  useOn(messages, () => {
    if (!mascot || status !== 'streaming') {
      return
    }
    const toolPart = (messages.at(-1)?.parts ?? []).find(isToolUIPart)
    if (!toolPart || lastTool.current === toolPart.type) {
      return
    }
    lastTool.current = toolPart.type
    mascot.play(animations.tool, { interrupt: true })
  })
}

const pickOpen = () =>
  animations.open[Math.floor(Math.random() * animations.open.length)] ??
  animations.show
