'use client'

import { type ChatStatus, getToolName, isToolUIPart } from 'ai'
import { useEffect, useRef } from 'react'
import type { ChatUIMessage } from '@/lib/ai/chat/types'
import { type AnimationName, animations, toolAnimations } from './constants'
import type { SimbaController } from './controller'
import { useGutterSpot, usePageSimba, useTriggerAway } from './presence'

const NAP_AFTER_MS = 60_000

const WAKE_EVENTS = [
  'keydown',
  'pointerdown',
  'pointermove',
  'scroll',
  'touchstart',
  'wheel',
] as const

type Part = ChatUIMessage['parts'][number]

// Step boundaries and the sources a search writes don't move him on, so a
// tool's pose holds until the model writes, thinks or calls the next tool
const showsProgress = (part: Part) =>
  part.type === 'text' || part.type === 'reasoning' || isToolUIPart(part)

const activityFor = (
  open: boolean,
  status: ChatStatus,
  messages: ChatUIMessage[]
): AnimationName | null => {
  if (!open) {
    return null
  }
  if (status === 'submitted') {
    return animations.submit
  }
  if (status !== 'streaming') {
    return null
  }
  const part = messages.at(-1)?.parts.findLast(showsProgress)
  if (!part || part.type === 'reasoning') {
    return animations.thinking
  }
  if (isToolUIPart(part)) {
    if (part.state === 'output-error') {
      return animations.thinking
    }
    return toolAnimations[getToolName(part)] ?? animations.tool
  }
  return animations.writing
}

function useNap(mascot: SimbaController | undefined, allowed: boolean) {
  useEffect(() => {
    if (!(mascot && allowed)) {
      return
    }
    let lastInput = Date.now()
    let timer: ReturnType<typeof setTimeout> | undefined
    let cancelled = false
    const doze = () => {
      clearTimeout(timer)
      timer = undefined
      if (cancelled || document.visibilityState !== 'visible') {
        return
      }
      const idle = Date.now() - lastInput
      if (idle >= NAP_AFTER_MS) {
        mascot.nap()
        return
      }
      timer = setTimeout(doze, NAP_AFTER_MS - idle)
    }
    const onInput = () => {
      lastInput = Date.now()
      mascot.wake()
      if (!timer) {
        doze()
      }
    }
    // Time in a background tab doesn't count
    const onVisibilityChange = () => {
      lastInput = Date.now()
      doze()
    }
    const options = { capture: true, passive: true }
    for (const type of WAKE_EVENTS) {
      window.addEventListener(type, onInput, options)
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    if (document.visibilityState === 'visible') {
      timer = setTimeout(doze, NAP_AFTER_MS)
    }
    return () => {
      cancelled = true
      clearTimeout(timer)
      for (const type of WAKE_EVENTS) {
        window.removeEventListener(type, onInput, options)
      }
      document.removeEventListener('visibilitychange', onVisibilityChange)
      mascot.wake()
    }
  }, [allowed, mascot])
}

export function useMascotPanel({
  expanded,
  mascot,
  messages,
  open,
  status,
}: {
  expanded: boolean
  mascot: SimbaController | undefined
  messages: ChatUIMessage[]
  open: boolean
  status: ChatStatus
}) {
  const activity = activityFor(open, status, messages)
  const gutter = useGutterSpot({ expanded, open })
  const away = useTriggerAway({ expanded, open }) && !gutter

  const synced = useRef<{ activity: AnimationName | null; open: boolean }>(null)
  useEffect(() => {
    const last = synced.current
    synced.current = { activity, open }
    if (activity !== last?.activity) {
      mascot?.setActivity(activity)
    }
    if (open !== last?.open) {
      if (open) {
        mascot?.play(animations.open, { interrupt: true })
      } else if (last?.open) {
        mascot?.settle()
      }
    }
    mascot?.setAway(away)
  }, [activity, away, mascot, open])

  const pageSimba = usePageSimba()
  const busy = status === 'submitted' || status === 'streaming'
  useNap(mascot, !(open || busy || pageSimba))
}
