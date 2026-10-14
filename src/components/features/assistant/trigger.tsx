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

// Avatars have different frame sizes, and the element has no size until it
// is shown, so anchor by the known frame size
const getPosition = (avatar: AvatarName) => {
  const [width, height] = avatarMeta[avatar].frame
  return {
    x: window.innerWidth - EDGE_OFFSET - width,
    y: window.innerHeight - EDGE_OFFSET - height,
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

    const onQueueEmpty = () => {
      if (idleCycles >= target) {
        idleCycles = 0
        target = cyclesUntilAction()
        playAnimation(agent, animations.idle)
      } else {
        idleCycles++
        agent.play('Idle', 3000)
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
