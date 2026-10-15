'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useAssistantContext } from '@/components/features/assistant/assistant'
import { useMascot } from '@/components/features/assistant/mascot'
import {
  type AvatarName,
  animations,
  avatarMeta,
} from '@/components/features/assistant/mascot/constants'
import { playAnimation } from '@/components/features/assistant/mascot/utils'

// Matches the panel's right-4 inset so the dog lines up with it
const EDGE_OFFSET = 16

// Avatars differ in frame size and in the empty space around the dog, and the
// element has no size until it is shown, so anchor the visible dog using the
// known frame size and padding
const getPosition = (avatar: AvatarName) => {
  const { frame, padding } = avatarMeta[avatar]
  return {
    x: window.innerWidth - EDGE_OFFSET - frame[0] + padding.right,
    y: window.innerHeight - EDGE_OFFSET - frame[1] + padding.bottom,
  }
}

function InnerTrigger() {
  const { setOpen } = useAssistantContext()
  const { agent, avatar } = useMascot()

  useEffect(() => {
    if (!agent) {
      return
    }

    let idleCycles = 0
    const cyclesUntilAction = () => 3 + Math.floor(Math.random() * 4)
    let target = cyclesUntilAction()

    // Avatars name their animations differently, so use what this one has
    const rest = animations.rest.find((name) => agent.hasAnimation(name))
    const actions = animations.idle.filter((name) => agent.hasAnimation(name))

    const onQueueEmpty = () => {
      if (idleCycles >= target && actions.length > 0) {
        idleCycles = 0
        target = cyclesUntilAction()
        playAnimation(agent, actions)
      } else if (rest) {
        idleCycles++
        agent.play(rest, 3000)
      }
    }
    agent._onQueueEmpty = onQueueEmpty
    agent._queue._onEmptyCallback = onQueueEmpty

    const place = () => {
      const { x, y } = getPosition(avatar)
      agent._el.style.left = `${x}px`
      agent._el.style.top = `${y}px`
    }
    place()
    agent._el.style.zIndex = '45'
    // Below lg there's no side gutter for the dog, so it would sit on content
    agent._el.dataset.mascot = ''
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
  }, [agent, avatar, setOpen])

  return null
}

export const AssistantTrigger = dynamic(() => Promise.resolve(InnerTrigger), {
  ssr: false,
})
