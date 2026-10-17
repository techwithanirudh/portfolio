'use client'

import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { useAssistantContext } from '@/components/features/assistant'
import {
  setPeeking,
  usePageSimba,
} from '@/components/features/assistant/mascot/presence'
import { SimbaRig } from '@/components/features/assistant/mascot/rig'
import { MEDIA } from '@/lib/media'

/**
 * Simba pops his head up over the footer's top edge once it scrolls into view
 * and ducks back down when it leaves. The window clips him at the edge, so his
 * lower half stays behind the footer. While he peeks the corner Simba steps
 * away, unless the chat is open, and he stays down when the page has its own
 * Simba. Wide screens only: the corner Simba is
 * desktop only, and narrower footers need the room for the guestbook line.
 */
export function SimbaPeek() {
  const { open, setOpen } = useAssistantContext()
  const wide = useMediaQuery(MEDIA.docked, { initializeWithValue: false })
  const edgeRef = useRef<HTMLDivElement>(null)
  const [edgeInView, setEdgeInView] = useState(false)
  const pageSimba = usePageSimba()

  useEffect(() => {
    const edge = edgeRef.current
    if (!edge) {
      return
    }
    // Waits until the edge is clear of the fade along the bottom of the screen
    const observer = new IntersectionObserver(
      ([entry]) => setEdgeInView(entry?.isIntersecting ?? false),
      { rootMargin: '0px 0px -15% 0px' }
    )
    observer.observe(edge)
    return () => observer.disconnect()
  }, [])

  const shown = edgeInView && !open && wide && !pageSimba

  useEffect(() => {
    setPeeking(shown)
  }, [shown])

  useEffect(() => () => setPeeking(false), [])

  return (
    <>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-0 top-0 h-px'
        ref={edgeRef}
      />
      <div className='pointer-events-none absolute right-6 bottom-full h-[5.25rem] w-[5.5rem] overflow-hidden max-lg:hidden sm:right-10 print:hidden'>
        <button
          aria-label='Ask Simba'
          className='pointer-events-auto absolute inset-x-0 top-0 translate-y-full outline-none transition-[translate] duration-200 ease-in data-shown:translate-y-0 data-shown:duration-500 data-shown:ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none focus-visible:[&_svg]:drop-shadow-[0_0_2px_var(--color-ring)]'
          data-native-cursor
          data-shown={shown || undefined}
          inert={!shown}
          onClick={() => setOpen(true)}
          type='button'
        >
          <SimbaRig className='mx-auto' pose='attention' size={112} />
        </button>
      </div>
    </>
  )
}
