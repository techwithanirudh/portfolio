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

    const { x, y } = getPosition()
    // Batch all style mutations in one cssText assignment to avoid multiple reflows
    agent._el.style.cssText += `left:${x}px;top:${y}px;z-index:45;`
    agent.show(true)

    const handleClick = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      setOpen((prev) => !prev)
    }

    const handleResize = () => {
      const { x, y } = getPosition()
      // Batch both style mutations together
      agent._el.style.cssText += `left:${x}px;top:${y}px;`
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
