'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { useClippy } from '@/components/clippy'
import { useAISearchContext } from './ai-search'

function getPosition() {
  return {
    x: window.innerWidth - 90,
    y: window.innerHeight - 100,
  }
}

function ClippyTriggerInner() {
  const { open, setOpen } = useAISearchContext()
  const { clippy } = useClippy()
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

    const handleClick = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      setOpen(!openRef.current)
    }

    const handleResize = () => {
      window.requestAnimationFrame(() => reposition())
    }

    clippy.on('click', handleClick)
    window.addEventListener('resize', handleResize)

    return () => {
      clippy.off('click', handleClick)
      window.removeEventListener('resize', handleResize)
    }
  }, [clippy, setOpen])

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
