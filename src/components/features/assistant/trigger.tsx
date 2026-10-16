'use client'

import { useEffect } from 'react'
import { useAssistantContext } from '@/components/features/assistant/context'
import { useMascot } from '@/components/features/assistant/mascot'
import {
  animations,
  sprite,
} from '@/components/features/assistant/mascot/constants'
import { playAnimation } from '@/components/features/assistant/mascot/utils'

// Matches the panel's right-4 inset so the dog lines up with it
const EDGE_OFFSET = 16

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

    let idleCycles = 0
    const cyclesUntilAction = () => 3 + Math.floor(Math.random() * 4)
    let target = cyclesUntilAction()

    const onQueueEmpty = () => {
      if (idleCycles >= target) {
        idleCycles = 0
        target = cyclesUntilAction()
        playAnimation(agent, animations.idle)
      } else {
        idleCycles++
        agent.play(animations.rest, 3000)
      }
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
