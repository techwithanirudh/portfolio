'use client'

import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMediaQuery } from 'usehooks-ts'
import { Button } from '@/components/ui/button'
import { MEDIA } from '@/lib/media'
import { useAssistantContext } from './context'
import { SimbaChip } from './mascot/simba-chip'

const getContainer = () => document.getElementById('main-content')

// Rapid clicks on a control (the portrait bonk) extend into the words next to
// it, which isn't a deliberate selection. Links stay selectable: sentences
// with links in them are the feature
const SETTLE_MS = 200
const CONTROL_SELECTOR =
  'button, input, textarea, select, summary, [role="button"], [contenteditable="true"]'

const isInsideControl = (node: Node | null) =>
  Boolean(
    (node instanceof Element ? node : node?.parentElement)?.closest(
      CONTROL_SELECTOR
    )
  )

interface PopupState {
  text: string
}

export function TextSelectionPopup() {
  const { setContext, setOpen } = useAssistantContext()
  const [popup, setPopup] = useState<PopupState | null>(null)
  const startedOnControl = useRef(false)
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
    if (text.length === 0 || startedOnControl.current) {
      setPopup(null)
      return
    }

    const range = selection.getRangeAt(0).cloneRange()
    if (
      !container.contains(range.commonAncestorContainer) ||
      Array.from(container.querySelectorAll(CONTROL_SELECTOR)).some((control) =>
        range.intersectsNode(control)
      )
    ) {
      setPopup(null)
      return
    }

    refs.setReference({
      contextElement: container,
      getBoundingClientRect() {
        return range.getBoundingClientRect()
      },
    })

    // TODO(slopradar): magic-number: the 1200-character cap on selected context exists only here and contextDataSchema has no max, name it once and enforce it with .max() on the schema so the server applies the same limit
    setPopup({ text: text.slice(0, 1200) })
  })

  // TODO(slopradar): library-exists: Escape, outside-press dismissal and the portal are hand-written over @floating-ui/react-dom (its only user); Base UI Popover takes a virtual anchor and controlled open and owns dismissal, check initialFocus keeps the selection
  const closeOnEscape = useEffectEvent((e: KeyboardEvent) => {
    startedOnControl.current = false
    if (popup !== null && e.key === 'Escape') {
      setPopup(null)
    }
  })

  const closeOnPointerDown = useEffectEvent((e: PointerEvent) => {
    const target = e.target
    startedOnControl.current = target instanceof Node && isInsideControl(target)
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
    let timer: number | null = null

    const scheduleUpdate = () => {
      if (timer !== null) {
        window.clearTimeout(timer)
      }
      timer = window.setTimeout(() => {
        timer = null
        updatePopup()
      }, SETTLE_MS)
    }

    document.addEventListener('selectionchange', scheduleUpdate)
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOnPointerDown)

    return () => {
      document.removeEventListener('selectionchange', scheduleUpdate)
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOnPointerDown)
      if (timer !== null) {
        window.clearTimeout(timer)
      }
    }
  }, [])

  return popup
    ? createPortal(
        <div
          className='not-prose z-25'
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
            Ask <SimbaChip className='translate-y-0' /> Simba
          </Button>
        </div>,
        document.body
      )
    : null
}
