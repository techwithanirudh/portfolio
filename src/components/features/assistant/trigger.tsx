'use client'

import { useEffect } from 'react'
import { useAssistantContext } from '@/components/features/assistant/context'
import { useMascot } from '@/components/features/assistant/mascot'
import {
  animations,
  sprite,
} from '@/components/features/assistant/mascot/constants'
import { mascotActivity } from '@/components/features/assistant/mascot/hooks'
import { playAnimation } from '@/components/features/assistant/mascot/utils'
import { prefersReducedMotion } from '@/lib/reduced-motion'

const EDGE_OFFSET = 16
const REST_MS = 3000
const IDLE_MIN_MS = 15_000
const IDLE_MAX_MS = 30_000

// The element has no size until it is shown, so anchor the visible dog using
// the known frame size and the empty space around it
const getPosition = () => {
  const { frame, padding } = sprite
  return {
    x: window.innerWidth - EDGE_OFFSET - frame[0] + padding.right,
    y: window.innerHeight - EDGE_OFFSET - frame[1] + padding.bottom,
  }
}

export function AssistantTrigger() {
  const { setOpen } = useAssistantContext()
  const { agent } = useMascot()

  useEffect(() => {
    if (!agent) {
      return
    }

    const idleGap = () =>
      IDLE_MIN_MS + Math.random() * (IDLE_MAX_MS - IDLE_MIN_MS)
    let nextIdleAt = Date.now() + idleGap()

    const onQueueEmpty = () => {
      if (mascotActivity.current) {
        agent.play(mascotActivity.current)
        return
      }
      if (!prefersReducedMotion() && Date.now() >= nextIdleAt) {
        nextIdleAt = Date.now() + idleGap()
        playAnimation(agent, animations.idle)
        return
      }
      agent.play(animations.rest, REST_MS)
    }
    agent._onQueueEmpty = onQueueEmpty
    agent._queue._onEmptyCallback = onQueueEmpty

    const place = () => {
      const { x, y } = getPosition()
      agent._el.style.left = `${x}px`
      agent._el.style.top = `${y}px`
    }
    place()
    agent._el.style.zIndex = '45'
    agent.show(true)

    const handleClick = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      setOpen((prev) => !prev)
    }

    agent._el.addEventListener('click', handleClick)
    window.addEventListener('resize', place)

    return () => {
      agent._el.removeEventListener('click', handleClick)
      window.removeEventListener('resize', place)
    }
  }, [agent, setOpen])

  return null
}
