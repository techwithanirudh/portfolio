'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { useLenis } from 'lenis/react'
import { usePathname } from 'next/navigation'
import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useScrollLock } from 'usehooks-ts'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { cn } from '@/lib/utils'
import { useChatContext } from './chat-context'
import { expandedColumn } from './class-names'
import { useAssistantContext } from './context'
import { AssistantHeader } from './header'
import { AssistantInput } from './input'
import { useMascot } from './mascot'
import { useMascotPanel } from './mascot/hooks'
import { MessageList } from './message-list'

function PageScrollLock() {
  const lenis = useLenis()
  useScrollLock()

  useEffect(() => {
    if (!lenis) {
      return
    }
    lenis.stop()
    return () => lenis.start()
  }, [lenis])

  return null
}

function LeaveOnRouteChange() {
  const { isDocked, setExpanded, setOpen } = useAssistantContext()
  const pathname = usePathname()
  const [openedOn] = useState(pathname)

  useEffect(() => {
    if (pathname === openedOn) {
      return
    }
    if (isDocked) {
      setExpanded(false)
    } else {
      setOpen(false)
    }
  }, [isDocked, openedOn, pathname, setExpanded, setOpen])

  return null
}

// Nothing opens the panel through a Dialog.Trigger, so Base UI would return focus to the body
function useReturnFocus(
  open: boolean,
  popupRef: RefObject<HTMLDivElement | null>
) {
  const lastFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (open) {
      return
    }
    const remember = (event: FocusEvent) => {
      if (
        event.target instanceof HTMLElement &&
        !popupRef.current?.contains(event.target)
      ) {
        lastFocused.current = event.target
      }
    }
    document.addEventListener('focusin', remember)
    return () => document.removeEventListener('focusin', remember)
  }, [open, popupRef])

  return () => {
    // The docked panel also closes on Escape while the visitor works on the
    // page, and focus should stay where they are
    const active = document.activeElement
    if (
      active instanceof HTMLElement &&
      active !== document.body &&
      !popupRef.current?.contains(active)
    ) {
      return false
    }
    return lastFocused.current?.isConnected ? lastFocused.current : true
  }
}

const MORPH_EASING = 'cubic-bezier(0.2, 0, 0, 1)'
const GROW_MS = 380
const SHRINK_MS = 300

function useMorph() {
  const { expanded, morphFrom, open, popupRef } = useAssistantContext()
  const contentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const popup = popupRef.current
    const first = morphFrom.current
    morphFrom.current = null
    if (!(popup && first && open) || prefersReducedMotion()) {
      return
    }

    const next = popup.getBoundingClientRect()
    const duration = expanded ? GROW_MS : SHRINK_MS
    popup.animate(
      [
        {
          transform: `translate(${first.left - next.left}px, ${first.top - next.top}px) scale(${first.width / next.width}, ${first.height / next.height})`,
          transformOrigin: 'top left',
        },
        { transform: 'none', transformOrigin: 'top left' },
      ],
      { duration, easing: MORPH_EASING }
    )
    contentRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
      delay: duration * 0.3,
      duration: duration * 0.5,
      easing: 'ease-out',
      fill: 'backwards',
    })
  }, [expanded, morphFrom, open, popupRef])

  return contentRef
}

const trackBandHeight = (band: HTMLDivElement) => {
  const root = document.documentElement.style
  const observer = new ResizeObserver(([entry]) => {
    root.setProperty('--simba-band', `${entry?.borderBoxSize[0]?.blockSize}px`)
  })
  observer.observe(band)
  return () => {
    observer.disconnect()
    root.removeProperty('--simba-band')
  }
}

export function AssistantPanel() {
  const { expanded, isDocked, mode, open, popupRef, setExpanded, setOpen } =
    useAssistantContext()
  const chat = useChatContext()
  const mascot = useMascot()
  const finalFocus = useReturnFocus(open, popupRef)
  const contentRef = useMorph()

  useMascotPanel({
    expanded,
    mascot,
    messages: chat.messages,
    open,
    status: chat.status,
  })

  return (
    <DialogPrimitive.Root
      disablePointerDismissal={mode === 'docked'}
      modal={mode === 'docked' ? false : 'trap-focus'}
      onOpenChange={(next, { event, reason }) => {
        // A click on him is his own reaction (the trigger)
        if (
          reason === 'outside-press' &&
          event.target instanceof Element &&
          event.target.closest('[data-simba-trigger]')
        ) {
          return
        }
        const dismiss = reason === 'escape-key' || reason === 'outside-press'
        if (!next && expanded && dismiss) {
          setExpanded(false)
          return
        }
        setOpen(next)
      }}
      // The expanded panel fades out where it is, so it docks only once gone
      onOpenChangeComplete={(next) => {
        if (!next) {
          setExpanded(false)
        }
      }}
      open={open}
    >
      {open && mode !== 'docked' ? <PageScrollLock /> : null}
      {open && mode !== 'docked' ? <LeaveOnRouteChange /> : null}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className={cn(
            'fixed inset-0 z-30 touch-none bg-overlay backdrop-blur-xs transition-opacity duration-200 ease-out-strong data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-150',
            mode === 'docked' && 'hidden',
            mode === 'expanded' && 'data-ending-style:duration-300'
          )}
        />
        <DialogPrimitive.Popup
          aria-label='Ask Simba'
          className='fixed inset-x-4 top-[max(1rem,env(safe-area-inset-top))] bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50 flex origin-bottom flex-col overflow-hidden rounded-lg border border-dashed bg-popover text-popover-foreground shadow-lg outline-none transition-[opacity,scale] duration-200 ease-out-strong data-ending-style:scale-96 data-starting-style:scale-96 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-150 motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100 sm:inset-x-auto sm:top-auto sm:right-[max(1rem,env(safe-area-inset-right))] sm:bottom-28 sm:h-[min(500px,calc(100dvh-8rem))] sm:w-[360px] sm:origin-bottom-right sm:data-expanded:data-ending-style:scale-100 sm:data-expanded:data-ending-style:duration-300 sm:data-expanded:inset-0 sm:data-expanded:h-dvh sm:data-expanded:w-auto sm:data-expanded:origin-center sm:data-expanded:rounded-none sm:data-expanded:border-0 sm:data-expanded:shadow-none sm:[@media(max-height:640px)]:bottom-[max(1rem,env(safe-area-inset-bottom))] sm:[@media(max-height:640px)]:h-[calc(100dvh-2rem)]'
          data-expanded={expanded || undefined}
          // Keeps the site's components in their phone layout (the `wide` variant)
          data-narrow={!expanded || undefined}
          data-simba-panel
          data-sound-press='off'
          finalFocus={finalFocus}
          // Same-page hash links change no route, so a followed link docks it here too
          onClickCapture={(event) => {
            const link =
              event.target instanceof Element ? event.target.closest('a') : null
            const followed =
              link?.origin === window.location.origin &&
              !link.target &&
              !(
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              )
            if (!followed) {
              return
            }
            if (!isDocked) {
              setOpen(false)
            } else if (expanded) {
              setExpanded(false)
            }
          }}
          ref={popupRef}
          // Named only while mounted so a view transition (a project card morph)
          // keeps it above the shared images, see globals.css
          style={{ viewTransitionName: 'simba-panel' }}
        >
          <div className='dashed-stack flex h-full flex-col' ref={contentRef}>
            <AssistantHeader />
            <MessageList messages={chat.messages} status={chat.status} />
            <div
              className='border-t border-dashed bg-card text-card-foreground has-focus-visible:border-primary'
              ref={trackBandHeight}
            >
              <div className={expandedColumn}>
                <AssistantInput />
              </div>
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
