'use client'

import { type ChatStatus, getToolName, isToolUIPart } from 'ai'
import { useEffect } from 'react'
import { useOn } from '@/hooks/use-on'
import type { MyUIMessage } from '@/lib/ai/chat/types'
import { type AnimationName, animations, toolAnimations } from './constants'
import { pick, type SimbaController } from './controller'
import { usePageSimba } from './presence'

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

  // Never while the panel is open or answering, or while he's away for a
  // page's own Simba
  const pageSimba = usePageSimba()
  const busy = status === 'submitted' || status === 'streaming'
  useNap(mascot, !(open || busy || pageSimba))
}
