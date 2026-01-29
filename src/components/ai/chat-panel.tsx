'use client'

import { Presence } from '@radix-ui/react-presence'
import { isToolUIPart } from 'ai'
import { useEffect, useEffectEvent, useRef } from 'react'
import { animations, useClippy } from '@/components/clippy'
import { cn } from '@/lib/utils'
import { useChatContext, useChatContextValue } from './chat-context'
import { ChatHeader } from './chat-header'
import { ChatInput } from './chat-input'
import { ChatMessages } from './chat-messages'

export function ChatPanel() {
  const { open, setOpen } = useChatContextValue()
  const chat = useChatContext()
  const { clippy } = useClippy()
  const lastTool = useRef<string | null>(null)
  const lastOpen = useRef(open)

  const onKeyPress = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === 'Escape' && open) {
      setOpen(false)
      event.preventDefault()
    }
    if (event.key === '/' && (event.metaKey || event.ctrlKey) && !open) {
      setOpen(true)
      event.preventDefault()
    }
  })

  useEffect(() => {
    window.addEventListener('keydown', onKeyPress)
    return () => window.removeEventListener('keydown', onKeyPress)
  }, [])

  useEffect(() => {
    if (chat.status !== 'ready' || !clippy) {
      return
    }
    const last = chat.messages.at(-1)
    if (last?.role === 'assistant') {
      clippy.stopCurrent()
    }
  }, [chat.messages, chat.status, clippy])

  useEffect(() => {
    if (lastOpen.current === open || !clippy) {
      return
    }
    lastOpen.current = open
    clippy.stopCurrent()
    clippy.play(open ? animations.open : animations.bye)
  }, [open, clippy])

  useEffect(() => {
    if (!clippy) {
      return
    }

    const lastMessage = chat.messages.at(-1)
    const parts = lastMessage?.parts ?? []
    const toolPart = parts.find((part) => isToolUIPart(part))

    if (!toolPart || chat.status === 'ready') {
      lastTool.current = null
      return
    }

    if (lastTool.current === toolPart.type) {
      return
    }

    lastTool.current = toolPart.type
    clippy.stopCurrent()
    clippy.play(animations.tool)
  }, [chat.messages, chat.status, clippy])

  return (
    <>
      <Presence present={open}>
        <button
          aria-label='Close Rover panel'
          className='fixed inset-0 z-30 bg-fd-overlay backdrop-blur-xs data-[state=closed]:animate-fd-fade-out data-[state=open]:animate-fd-fade-in lg:hidden'
          data-state={open ? 'open' : 'closed'}
          onClick={() => setOpen(false)}
          type='button'
        />
      </Presence>
      <Presence present={open}>
        <div
          className={cn(
            'fixed inset-x-4 top-4 bottom-28 z-50 flex flex-col overflow-hidden rounded-lg border border-dashed bg-fd-popover text-fd-popover-foreground shadow-lg sm:inset-x-auto sm:top-auto sm:right-4 sm:h-[500px] sm:w-[360px]',
            open ? 'animate-fd-dialog-in' : 'animate-fd-dialog-out'
          )}
        >
          <div className='flex h-full flex-col divide-y divide-dashed divide-border'>
            <ChatHeader />
            <ChatMessages messages={chat.messages} status={chat.status} />
            <ChatInput />
          </div>
        </div>
      </Presence>
    </>
  )
}
