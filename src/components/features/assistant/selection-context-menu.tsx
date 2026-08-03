'use client'

import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import {
  type ReactNode,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { useAISearchContext } from './chat'

interface PopupState {
  text: string
}

export function SelectionContent({ children }: { children: ReactNode }) {
  const { setContext, setOpen } = useAISearchContext()
  const containerRef = useRef<HTMLDivElement>(null)
  const [popup, setPopup] = useState<PopupState | null>(null)

  const { refs, floatingStyles } = useFloating({
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    open: popup !== null,
    placement: 'top',
    whileElementsMounted: autoUpdate,
  })

  const updatePopup = useEffectEvent(() => {
    const container = containerRef.current
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
      containerRef.current?.contains(target)
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

  return (
    <>
      {/*
        `contents` keeps this wrapper out of the layout, but it is still a DOM
        child, so the parent's `divide-y` sees one child and draws nothing --
        and a `contents` box cannot paint a border anyway. Dividing here puts
        the separators back on the sections themselves. `divide-y` skips the
        last child, so the rule above the footer is restored explicitly.
      */}
      <div
        className='contents divide-y divide-dashed divide-border [&>:last-child]:border-border [&>:last-child]:border-b [&>:last-child]:border-dashed'
        ref={containerRef}
      >
        {children}
      </div>
      {popup &&
        createPortal(
          <div
            className='not-prose z-[25]'
            ref={refs.setFloating}
            style={floatingStyles}
          >
            <button
              className={cn(
                buttonVariants({
                  className: 'shadow-lg',
                  color: 'primary',
                  size: 'sm',
                })
              )}
              onClick={() => {
                setContext(popup.text)
                setOpen(true)
                setPopup(null)
              }}
              type='button'
            >
              Ask Simba
            </button>
          </div>,
          document.body
        )}
    </>
  )
}
