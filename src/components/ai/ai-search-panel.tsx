'use client'

import { Presence } from '@radix-ui/react-presence'
import { isToolUIPart } from 'ai'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { PawPrint, PlusIcon, RefreshCw, X } from 'lucide-react'
import { useEffect, useEffectEvent, useMemo, useRef } from 'react'
import { useClippy } from '@/components/clippy'
import { animations } from '@/components/clippy/animations'
import { cn } from '@/lib/utils'
import { useAISearchContext, useChatContext } from './ai-search-context'
import { SearchAIInput } from './ai-search-input'
import { MessageList } from './ai-search-messages'

function Header() {
  const { setOpen, chat } = useAISearchContext()

  return (
    <div className='sticky top-0 flex h-10 items-start'>
      <div className='flex min-h-full flex-1 items-center justify-between rounded-none bg-fd-card px-3 py-2 text-fd-card-foreground'>
        <div className='flex items-center gap-2'>
          <PawPrint className='size-4 text-fd-primary transition-transform duration-200 hover:-rotate-45' />
          <p className='font-medium text-sm'>Ask Simba</p>
        </div>
      </div>

      <div className='flex min-h-full'>
        <button
          className={cn(
            buttonVariants({
              color: 'secondary',
              size: 'icon-sm',
              className:
                'group/button w-10 flex-1 rounded-none border-none [&_svg]:size-4',
            })
          )}
          onClick={() => chat.setMessages([])}
          type='button'
        >
          <PlusIcon className='transition-transform group-hover/button:rotate-90' />
        </button>
        <button
          aria-label='Close'
          className={cn(
            buttonVariants({
              size: 'icon-sm',
              color: 'primary',
              className:
                'group/button w-10 flex-1 rounded-none border-none [&_svg]:size-4',
            })
          )}
          onClick={() => setOpen(false)}
          tabIndex={-1}
          type='button'
        >
          <X className='transition-transform group-hover/button:rotate-90' />
        </button>
      </div>
    </div>
  )
}

function SearchAIActions() {
  const { messages, status, regenerate } = useChatContext()
  const isLoading = status === 'streaming'
  const canShow =
    !isLoading && messages?.length > 0 && messages.at(-1)?.role === 'assistant'

  return (
    <button
      aria-hidden={!canShow}
      className={cn(
        buttonVariants({
          color: 'secondary',
          size: 'icon-sm',
          className:
            'gap-1.5 rounded-none border border-dashed transition-opacity duration-200 [&_svg]:size-4',
        }),
        canShow ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      disabled={!canShow}
      onClick={() => regenerate()}
      tabIndex={canShow ? 0 : -1}
      type='button'
    >
      <RefreshCw />
    </button>
  )
}

export function AISearchPanel() {
  const { open, setOpen } = useAISearchContext()
  const chat = useChatContext()
  const { cancelAnimation, playAnimation } = useClippy()
  const lastToolRef = useRef<string | null>(null)
  const lastOpenRef = useRef(open)

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
    if (chat.status !== 'ready') {
      return
    }

    const last = chat.messages.at(-1)
    if (last?.role === 'assistant') {
      cancelAnimation()
    }
  }, [chat.messages, chat.status, cancelAnimation])

  useEffect(() => {
    if (lastOpenRef.current === open) {
      return
    }

    lastOpenRef.current = open
    playAnimation(open ? animations.open : animations.bye)
  }, [open, playAnimation])

  useEffect(() => {
    const lastMessage = chat.messages.at(-1)
    const parts = lastMessage?.parts ?? []
    const toolPart = parts.find((part) => isToolUIPart(part))
    if (!toolPart) {
      lastToolRef.current = null
      return
    }

    if (chat.status === 'ready') {
      lastToolRef.current = null
      return
    }

    if (lastToolRef.current === toolPart.type) {
      return
    }

    lastToolRef.current = toolPart.type
    playAnimation(animations.tool)
  }, [chat.messages, chat.status, playAnimation])

  const panelStyle = useMemo(
    () => ({
      maskImage:
        'linear-gradient(to bottom, transparent, white 1rem, white calc(100% - 1rem), transparent 100%)',
    }),
    []
  )

  return (
    <>
      <style>
        {`
        @keyframes ask-ai-open {
          from {
            width: 0px;
          }
          to {
            width: var(--ai-chat-width);
          }
        }
        @keyframes ask-ai-close {
          from {
            width: var(--ai-chat-width);
          }
          to {
            width: 0px;
          }
        }`}
      </style>
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
            <Header />
            <MessageList
              className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-3'
              messages={chat.messages}
              status={chat.status}
              style={panelStyle}
            />
            <div className='rounded-none border-t border-dashed bg-fd-card text-fd-card-foreground has-focus-visible:ring-2 has-focus-visible:ring-fd-ring'>
              <SearchAIInput />
              <div className='flex items-center gap-1.5 p-2'>
                <SearchAIActions />
              </div>
            </div>
          </div>
        </div>
      </Presence>
    </>
  )
}
