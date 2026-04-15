'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useAISearchContext } from '@/components/ai/chat'
import { useClippy } from '@/components/clippy'
import { animations } from '@/components/clippy/constants'
import { playAnimation } from '@/components/clippy/utils'

const getPosition = () => ({
  x: window.innerWidth - 90,
  y: window.innerHeight - 100,
})

function ClippyTriggerInner() {
  const { setOpen } = useAISearchContext()
  const { agent } = useClippy()

  useEffect(() => {
    if (!agent) {
      return
    }

    let idleCycles = 0
    const cyclesUntilAction = () => 3 + Math.floor(Math.random() * 4)
    let target = cyclesUntilAction()

    const onQueueEmpty = () => {
      idleCycles++
      if (idleCycles >= target) {
        idleCycles = 0
        target = cyclesUntilAction()
        playAnimation(agent, animations.idle)
      } else {
        agent.play('Idle', 3000)
      }
    }
    agent._onQueueEmpty = onQueueEmpty
    agent._queue._onEmptyCallback = onQueueEmpty

    const { x, y } = getPosition()
    agent._el.style.left = `${x}px`
    agent._el.style.top = `${y}px`
    agent._el.style.visibility = 'hidden'
    agent.show(true)
    requestAnimationFrame(() => {
      agent._el.style.visibility = 'visible'
    })

    const handleClick = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      setOpen((prev) => !prev)
    }

    const handleResize = () => {
      const { x, y } = getPosition()
      agent._el.style.left = `${x}px`
      agent._el.style.top = `${y}px`
    }

    agent._el.addEventListener('click', handleClick)
    window.addEventListener('resize', handleResize)

    return () => {
      agent._el.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
    }
  }, [agent, setOpen])

  return null
}

export const AISearchTrigger = dynamic(
  () => Promise.resolve(ClippyTriggerInner),
  { ssr: false }
)
