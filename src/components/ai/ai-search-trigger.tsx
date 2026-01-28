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

    clippy.show(true)
    const { x, y } = getPosition()
    clippy.moveTo(x, y, 0)

    const handleClick = (event: Event) => {
      const target = event.target
      if (!(target instanceof Element)) {
        return
      }

      if (!target.closest('.clippy')) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      setOpen(!openRef.current)
    }

    const handleResize = () => {
      const { x, y } = getPosition()
      clippy.moveTo(x, y, 0)
    }

    document.addEventListener('click', handleClick, true)
    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('click', handleClick, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [clippy, setOpen])

  return null
}

export const AISearchTrigger = dynamic(
  () => Promise.resolve(ClippyTriggerInner),
  { ssr: false }
)
