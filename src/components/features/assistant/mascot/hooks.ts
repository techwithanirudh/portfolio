'use client'

import { type ChatStatus, getToolName, isToolUIPart } from 'ai'
import { useEffect, useRef } from 'react'
import { useOn } from '@/hooks/use-on'
import type { MyUIMessage } from '@/lib/ai/chat/types'
import { type AnimationName, animations, toolAnimations } from './constants'
import type { SimbaController } from './controller'
import { usePageSimba, useTriggerAway } from './presence'

/** He naps after this long with no input from the visitor */
export const NAP_AFTER_MS = 60_000

const WAKE_EVENTS = [
  'keydown',
  'pointerdown',
  'pointermove',
  'scroll',
  'touchstart',
  'wheel',
] as const

type Part = MyUIMessage['parts'][number]

// Step boundaries and the sources a search writes don't move him on, so a
// tool's pose holds until the model writes, thinks or calls the next tool
const showsProgress = (part: Part) =>
  part.type === 'text' || part.type === 'reasoning' || isToolUIPart(part)

// Only while the panel is open: once it closes he stops answering, though the
// answer keeps streaming in for when it opens again
const activityFor = (
  open: boolean,
  status: ChatStatus,
  messages: MyUIMessage[]
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
    // A failed call leaves him working out what to do next
    if (part.state === 'output-error') {
      return animations.thinking
    }
    return toolAnimations[getToolName(part)] ?? animations.tool
  }
  return animations.writing
}

/**
 * Naps after NAP_AFTER_MS with no input while the tab is visible, and wakes on
 * any input or when he stops being allowed to (he wakes on cleanup)
 */
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
  messages: MyUIMessage[]
  open: boolean
  status: ChatStatus
}) {
  const activity = activityFor(open, status, messages)

  // Ahead of the greeting, so on reopening mid-answer he greets and then
  // talks again
  useOn(activity, () => {
    mascot?.setActivity(activity)
  })

  const wasOpen = useRef(open)
  useOn(open, () => {
    const closing = wasOpen.current && !open
    wasOpen.current = open
    if (!mascot) {
      return
    }
    if (open) {
      mascot.play(animations.open, { interrupt: true })
    } else if (closing) {
      mascot.settle()
    }
  })

  // He hides only while the trigger he sits in is away. After the greeting
  // and the settle, so a greeting asked for as he comes back plays then
  const away = useTriggerAway({ expanded, open })
  useEffect(() => {
    mascot?.setAway(away)
  }, [away, mascot])

  // Never while the panel is open or answering, or while he's away for a
  // page's own Simba
  const pageSimba = usePageSimba()
  const busy = status === 'submitted' || status === 'streaming'
  useNap(mascot, !(open || busy || pageSimba))
}
