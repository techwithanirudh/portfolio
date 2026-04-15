'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useAISearchContext } from '@/components/ai/chat'
import { useClippy } from '@/components/clippy'
import { animations } from '@/components/clippy/constants'
import { playAnimation } from '@/components/clippy/utils'
import { useJitteredInterval } from '@/hooks/use-jittered-interval'

const getPosition = () => ({
  x: window.innerWidth - 90,
  y: window.innerHeight - 100,
})

function ClippyTriggerInner() {
  const { setOpen } = useAISearchContext()
  const { agent } = useClippy()

  useJitteredInterval(
    () => agent && playAnimation(agent, animations.idle),
    3000,
    4000,
    !!agent
  )

  useEffect(() => {
    if (!agent) {
      return
    }

    const { x, y } = getPosition()
    agent.show(true)
    agent.moveTo(x, y, 0)

    agent._el.style.visibility = 'hidden'
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
