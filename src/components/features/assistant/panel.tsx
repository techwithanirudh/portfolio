'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { useLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'
import { useMediaQuery, useScrollLock } from 'usehooks-ts'
import { MEDIA } from '@/lib/media'
import { useChatContext } from './chat-context'
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

function useReturnFocus(open: boolean) {
  const popupRef = useRef<HTMLDivElement>(null)
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
  }, [open])

  const finalFocus = () =>
    lastFocused.current?.isConnected ? lastFocused.current : true

  return { finalFocus, popupRef }
}

export function AssistantPanel() {
  const { open, setOpen } = useAssistantContext()
  const chat = useChatContext()
  const mascot = useMascot()
  const isDocked = useMediaQuery(MEDIA.docked)
  const { finalFocus, popupRef } = useReturnFocus(open)

  useMascotPanel({
    mascot,
    messages: chat.messages,
    open,
    status: chat.status,
  })

  return (
    <DialogPrimitive.Root
      disablePointerDismissal
      modal={isDocked ? false : 'trap-focus'}
      onOpenChange={setOpen}
      open={open}
    >
      {open && !isDocked ? <PageScrollLock /> : null}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className='fixed inset-0 z-30 touch-none bg-overlay backdrop-blur-xs transition-opacity duration-200 ease-out-strong data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-150 lg:hidden'
          onClick={() => setOpen(false)}
        />
        <DialogPrimitive.Popup
          aria-label='Ask Simba'
          className='fixed inset-x-4 top-[max(1rem,env(safe-area-inset-top))] bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50 flex origin-bottom flex-col overflow-hidden rounded-lg border border-dashed bg-popover text-popover-foreground shadow-lg outline-none transition-[opacity,scale] duration-200 ease-out-strong data-ending-style:scale-96 data-starting-style:scale-96 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-150 sm:inset-x-auto sm:top-auto sm:right-[max(1rem,env(safe-area-inset-right))] sm:bottom-28 sm:h-[min(500px,calc(100dvh-8rem))] sm:w-[360px] sm:origin-bottom-right sm:[@media(max-height:640px)]:bottom-[max(1rem,env(safe-area-inset-bottom))] sm:[@media(max-height:640px)]:h-[calc(100dvh-2rem)]'
          data-sound-press='off'
          finalFocus={finalFocus}
          ref={popupRef}
        >
          <div className='dashed-stack flex h-full flex-col'>
            <AssistantHeader />
            <MessageList messages={chat.messages} status={chat.status} />
            <div className='border-t border-dashed bg-card text-card-foreground has-focus-visible:ring-2 has-focus-visible:ring-ring'>
              <AssistantInput />
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
