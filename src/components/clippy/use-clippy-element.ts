'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ClippyEventHandler } from './clippy-context'
import { syncListeners } from './events'

interface UseClippyElementOptions {
  draggable: boolean
}

export const useClippyElement = ({ draggable }: UseClippyElementOptions) => {
  const elementRef = useRef<HTMLElement | null>(null)
  const listenersRef = useRef(
    new Map<string, Map<ClippyEventHandler, EventListener>>()
  )
  const [element, setElement] = useState<HTMLElement | null>(null)

  const setElementRef = useCallback(() => {
    const nextElement = document.querySelector('.clippy') as HTMLElement | null
    elementRef.current = nextElement
    setElement(nextElement)
  }, [])

  useEffect(() => {
    syncListeners(listenersRef.current, element)

    if (!element || draggable) {
      return
    }

    const blockDrag = (event: MouseEvent) => {
      event.stopImmediatePropagation()
    }

    element.addEventListener('mousedown', blockDrag, true)
    return () => {
      element.removeEventListener('mousedown', blockDrag, true)
    }
  }, [draggable, element])

  return { elementRef, listenersRef, setElementRef }
}
