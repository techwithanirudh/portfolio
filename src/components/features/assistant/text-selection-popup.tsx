'use client'

import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom'
import { useEffect, useEffectEvent, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMediaQuery } from 'usehooks-ts'
import { Button } from '@/components/ui/button'
import { MEDIA } from '@/lib/media'
import { useAssistantContext } from './context'

const getContainer = () => document.getElementById('main-content')

interface PopupState {
  text: string
}

// Offers to ask Simba about text selected anywhere in the page content
export function TextSelectionPopup() {
  const { setContext, setOpen } = useAssistantContext()
  const [popup, setPopup] = useState<PopupState | null>(null)
  // Touch browsers draw their own Copy/Share callout above a selection, so
  // sit below it, clear of the selection handles
  const coarsePointer = useMediaQuery(MEDIA.coarsePointer, {
    initializeWithValue: false,
  })

  const { refs, floatingStyles } = useFloating({
    middleware: [offset(coarsePointer ? 28 : 8), flip(), shift({ padding: 8 })],
    open: popup !== null,
    placement: coarsePointer ? 'bottom' : 'top',
    whileElementsMounted: autoUpdate,
  })

  const updatePopup = useEffectEvent(() => {
    const container = getContainer()
    const selection = window.getSelection()

    if (
      !(container && selection) ||
      selection.isCollapsed ||
      selection.rangeCount === 0
    ) {
      setPopup(null)
      return
    }

    const text = selection.toString().trim()
    if (text.length === 0) {
      setPopup(null)
      return
    }

    const range = selection.getRangeAt(0).cloneRange()
    if (!container.contains(range.commonAncestorContainer)) {
      setPopup(null)
      return
    }

    refs.setReference({
      contextElement: container,
      getBoundingClientRect() {
        return range.getBoundingClientRect()
      },
    })

    setPopup({ text: text.slice(0, 1200) })
  })

  const closeOnEscape = useEffectEvent((e: KeyboardEvent) => {
    if (popup !== null && e.key === 'Escape') {
      setPopup(null)
    }
  })

  const closeOnPointerDown = useEffectEvent((e: PointerEvent) => {
    const target = e.target
    if (popup === null || !(target instanceof Node)) {
      return
    }
    if (
      refs.floating.current?.contains(target) ||
      getContainer()?.contains(target)
    ) {
      return
    }
    setPopup(null)
  })

  useEffect(() => {
    let frame: number | null = null

    const scheduleUpdate = () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame)
      }
      frame = window.requestAnimationFrame(() => {
        frame = null
        updatePopup()
      })
    }

    document.addEventListener('selectionchange', scheduleUpdate)
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOnPointerDown)

    return () => {
      document.removeEventListener('selectionchange', scheduleUpdate)
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOnPointerDown)
      if (frame !== null) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [])

  return popup
    ? createPortal(
        <div
          className='not-prose z-[25]'
          ref={refs.setFloating}
          style={floatingStyles}
        >
          <Button
            className='shadow-lg'
            onClick={() => {
              setContext(popup.text)
              setOpen(true)
              setPopup(null)
            }}
            size='sm'
          >
            Ask Simba
          </Button>
        </div>,
        document.body
      )
    : null
}
