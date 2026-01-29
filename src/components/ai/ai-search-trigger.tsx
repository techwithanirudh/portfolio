'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { useAISearchContext } from '@/components/ai/chat'
import { useClippy } from '@/components/clippy'

function getPosition() {
  return {
    x: window.innerWidth - 90,
    y: window.innerHeight - 100,
  }
}

function ClippyTriggerInner() {
  const { open, setOpen } = useAISearchContext()
  const { clippy, element } = useClippy()
  const openRef = useRef(open)

  useEffect(() => {
    openRef.current = open
  }, [open])

  useEffect(() => {
    if (!clippy) {
      return
    }

    const reposition = () => {
      const { x, y } = getPosition()
      clippy.moveTo(x, y, 0)
    }

    clippy.show(true)
    reposition()

    if (element) {
      element.style.visibility = 'hidden'
      requestAnimationFrame(() => {
        element.style.visibility = 'visible'
      })
    }

    const handleClick = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      setOpen(!openRef.current)
    }

    const handleResize = () => {
      window.requestAnimationFrame(() => reposition())
    }

    element?.addEventListener('click', handleClick)
    window.addEventListener('resize', handleResize)

    return () => {
      element?.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
    }
  }, [clippy, element, setOpen])

  useEffect(() => {
    if (!(clippy && open)) {
      return
    }

    const { x, y } = getPosition()
    clippy.moveTo(x, y, 0)
  }, [clippy, open])

  return null
}

export const AISearchTrigger = dynamic(
  () => Promise.resolve(ClippyTriggerInner),
  { ssr: false }
)
