'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { useAISearchContext } from '@/components/ai/chat'
import { useClippy } from '@/components/clippy/clippy-provider'

function getPosition() {
  return {
    x: window.innerWidth - 90,
    y: window.innerHeight - 100,
  }
}

function ClippyTriggerInner() {
  const { open, setOpen } = useAISearchContext()
  const { agent } = useClippy()
  const openRef = useRef(open)

  useEffect(() => {
    openRef.current = open
  }, [open])

  useEffect(() => {
    if (!agent) {
      return
    }

    const reposition = () => {
      const { x, y } = getPosition()
      agent.moveTo(x, y, 0)
    }

    agent.show(true)
    reposition()

    agent._el.style.visibility = 'hidden'
    requestAnimationFrame(() => {
      agent._el.style.visibility = 'visible'
    })

    const handleClick = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      setOpen(!openRef.current)
    }

    const handleResize = () => {
      window.requestAnimationFrame(() => reposition())
    }

    agent._el.addEventListener('click', handleClick)
    window.addEventListener('resize', handleResize)

    return () => {
      agent._el.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
    }
  }, [agent, setOpen])

  useEffect(() => {
    if (!(agent && open)) {
      return
    }

    const { x, y } = getPosition()
    agent.moveTo(x, y, 0)
  }, [agent, open])

  return null
}

export const AISearchTrigger = dynamic(
  () => Promise.resolve(ClippyTriggerInner),
  { ssr: false }
)
