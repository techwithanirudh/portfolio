'use client'

import { Popover } from '@base-ui/react/popover'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { Button } from '@/components/ui/button'
import { MAX_CONTEXT_LENGTH } from '@/lib/ai/chat/types'
import { MEDIA } from '@/lib/media'
import { useAssistantContext } from './context'
import { SimbaChip } from './mascot/simba-chip'

const getContainer = () => document.getElementById('main-content')

// Rapid clicks on a control (the portrait bonk) extend into nearby words, which isn't
// a deliberate selection. Links stay selectable
const CONTROL_SELECTOR =
  'button, input, textarea, select, summary, [role="button"], [contenteditable="true"]'

interface PopupState {
  anchor: { contextElement: Element; getBoundingClientRect: () => DOMRect }
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

    setPopup({
      anchor: {
        contextElement: container,
        getBoundingClientRect: () => range.getBoundingClientRect(),
      },
      text: text.slice(0, MAX_CONTEXT_LENGTH),
    })
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
      }, 200)
    }

    const resetStart = () => {
      startedOnControl.current = false
    }
    const trackStart = (e: PointerEvent) => {
      startedOnControl.current =
        e.target instanceof Node &&
        Boolean(
          (e.target instanceof Element
            ? e.target
            : e.target.parentElement
          )?.closest(CONTROL_SELECTOR)
        )
    }

    document.addEventListener('selectionchange', scheduleUpdate)
    document.addEventListener('keydown', resetStart)
    document.addEventListener('pointerdown', trackStart)

    return () => {
      document.removeEventListener('selectionchange', scheduleUpdate)
      document.removeEventListener('keydown', resetStart)
      document.removeEventListener('pointerdown', trackStart)
      if (timer !== null) {
        window.clearTimeout(timer)
      }
    }
  }, [])

  return (
    <Popover.Root
      onOpenChange={(open, { event, reason }) => {
        // A press in the page starts a new selection, which moves the popup
        const pressInPage =
          reason === 'outside-press' &&
          event.target instanceof Node &&
          getContainer()?.contains(event.target)
        if (!(open || pressInPage)) {
          setPopup(null)
        }
      }}
      open={popup !== null}
    >
      <Popover.Portal>
        <Popover.Positioner
          anchor={popup?.anchor}
          className='not-prose z-25'
          collisionPadding={8}
          side={coarsePointer ? 'bottom' : 'top'}
          sideOffset={coarsePointer ? 28 : 8}
        >
          {/* Focus stays in the page so the selection survives */}
          <Popover.Popup
            data-native-cursor
            finalFocus={false}
            initialFocus={false}
          >
            <Button
              className='shadow-lg'
              onClick={() => {
                if (popup) {
                  setContext(popup.text)
                }
                setOpen(true)
                setPopup(null)
              }}
              size='sm'
            >
              Ask <SimbaChip className='translate-y-0' /> Simba
            </Button>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
