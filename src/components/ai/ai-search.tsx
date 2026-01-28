'use client'
import { type UIMessage, type UseChatHelpers, useChat } from '@ai-sdk/react'
import { Presence } from '@radix-ui/react-presence'
import { DefaultChatTransport } from 'ai'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import {
  ArrowUpIcon,
  Dog,
  RefreshCw,
  SquareIcon,
  TrashIcon,
  X,
} from 'lucide-react'
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  type SyntheticEvent,
  use,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { MyUIMessage } from '@/app/api/chat/types'
import { ClippyProvider, useClippy } from '@/components/clippy'
import { cn } from '@/lib/utils'
import { Markdown } from './markdown'
import { MessageMetadata } from './message-metadata'

const Context = createContext<{
  open: boolean
  setOpen: (open: boolean) => void
  chat: UseChatHelpers<UIMessage>
} | null>(null)

export function useAISearchContext() {
  const ctx = use(Context)
  if (!ctx) {
    throw new Error('useAISearchContext must be used within AISearch')
  }
  return { open: ctx.open, setOpen: ctx.setOpen, chat: ctx.chat }
}

function useChatContext() {
  return use(Context)!.chat
}

function Header() {
  const { setOpen, chat } = use(Context)!

  return (
    <div className='sticky top-0 flex items-start'>
      <div className='flex flex-1 items-center justify-between rounded-none bg-fd-card px-3 py-2 text-fd-card-foreground'>
        <div className='flex items-center gap-2'>
          <Dog className='size-4 text-fd-primary transition-transform duration-200 hover:rotate-12' />
          <p className='font-medium text-sm'>Ask Rover</p>
        </div>
        <div className='flex items-center gap-1.5'>
          <button
            className={cn(
              buttonVariants({
                color: 'secondary',
                size: 'icon-xs',
                className: '[&_svg]:size-3.5',
              })
            )}
            onClick={() => chat.setMessages([])}
            type='button'
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      <button
        aria-label='Close'
        className={cn(
          buttonVariants({
            size: 'icon-sm',
            color: 'primary',
            className: 'size-10 rounded-none border-none',
          })
        )}
        onClick={() => setOpen(false)}
        tabIndex={-1}
        type='button'
      >
        <X />
      </button>
    </div>
  )
}

function SearchAIActions() {
  const { messages, status, regenerate } = useChatContext()
  const isLoading = status === 'streaming'

  return (
    <button
      className={cn(
        buttonVariants({
          color: 'secondary',
          size: 'icon-sm',
          className:
            'gap-1.5 rounded-none border border-dashed transition-opacity duration-200 [&_svg]:size-4',
        }),
        !isLoading &&
          messages?.length > 0 &&
          messages.at(-1)?.role === 'assistant'
          ? 'opacity-100'
          : 'opacity-0'
      )}
      onClick={() => regenerate()}
      type='button'
    >
      <RefreshCw />
    </button>
  )
}

const StorageKeyInput = '__ai_search_input'
function SearchAIInput(props: ComponentProps<'form'>) {
  const { status, sendMessage, stop } = useChatContext()
  const { showMessage, playAnimation, isAgentVisible } = useClippy()
  const pendingRef = useRef(false)
  const [input, setInput] = useState(
    () => localStorage.getItem(StorageKeyInput) ?? ''
  )
  const isLoading = status === 'streaming' || status === 'submitted'
  const playSearching = useEffectEvent(() => {
    if (!isAgentVisible) {
      pendingRef.current = true
      return
    }

    pendingRef.current = false
    playAnimation('Searching')
    showMessage('Searching', 2000)
  })
  const onStart = async (event?: SyntheticEvent) => {
    event?.preventDefault()
    playSearching()
    await sendMessage({ text: input })
    setInput('')
  }

  localStorage.setItem(StorageKeyInput, input)

  useEffect(() => {
    if (isLoading) {
      document.getElementById('nd-ai-input')?.focus()
    }
  }, [isLoading])

  useEffect(() => {
    if (!(pendingRef.current && isAgentVisible)) {
      return
    }

    pendingRef.current = false
    playAnimation('Searching')
    showMessage('Searching', 2000)
  }, [isAgentVisible, playAnimation, showMessage])

  return (
    <form
      {...props}
      className={cn('flex items-start pe-2', props.className)}
      onSubmit={onStart}
    >
      <Input
        autoFocus
        className={cn('p-3', isLoading && 'text-fd-muted-foreground')}
        disabled={status === 'streaming' || status === 'submitted'}
        onChange={(event) => {
          setInput(event.target.value)
        }}
        onKeyDown={(event) => {
          if (!event.shiftKey && event.key === 'Enter') {
            onStart(event)
          }
        }}
        placeholder={isLoading ? 'Sniffing for answers...' : 'Ask Rover'}
        value={input}
      />
      {isLoading ? (
        <button
          className={cn(
            buttonVariants({
              color: 'secondary',
              size: 'icon-sm',
              className:
                'mt-2 rounded-none border border-dashed transition-all [&_svg]:size-3.5',
            })
          )}
          key='bn'
          onClick={stop}
          type='button'
        >
          <SquareIcon className='fill-fd-foreground' />
        </button>
      ) : (
        <button
          className={cn(
            buttonVariants({
              color: 'primary',
              size: 'icon-sm',
              className:
                'mt-2 rounded-none border border-dashed transition-all [&_svg]:size-4',
            })
          )}
          disabled={input.length === 0}
          key='bn'
          type='submit'
        >
          <ArrowUpIcon />
        </button>
      )}
    </form>
  )
}

function List(props: Omit<ComponentProps<'div'>, 'dir'>) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    function callback() {
      const container = containerRef.current
      if (!container) {
        return
      }

      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100

      if (isNearBottom) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'instant',
        })
      }
    }

    const observer = new ResizeObserver(callback)
    callback()

    const element = containerRef.current?.firstElementChild

    if (element) {
      observer.observe(element)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      {...props}
      className={cn(
        'fd-scroll-container flex min-w-0 flex-col overflow-y-auto',
        props.className
      )}
      data-lenis-prevent
    >
      {props.children}
    </div>
  )
}

function Input(props: ComponentProps<'textarea'>) {
  const ref = useRef<HTMLDivElement>(null)
  const shared = cn('col-start-1 row-start-1', props.className)

  return (
    <div className='grid flex-1'>
      <textarea
        id='nd-ai-input'
        {...props}
        className={cn(
          'resize-none bg-transparent placeholder:text-fd-muted-foreground focus-visible:outline-none',
          shared
        )}
      />
      <div className={cn(shared, 'invisible break-all')} ref={ref}>
        {`${props.value?.toString() ?? ''}\n`}
      </div>
    </div>
  )
}

const roleName: Record<string, string> = {
  user: 'you',
  assistant: 'assistant',
}

function Message({
  message,
  isInProgress,
  ...props
}: {
  message: MyUIMessage
  isInProgress: boolean
} & ComponentProps<'div'>) {
  const parts = (message.parts ?? []) as MyUIMessage['parts']

  return (
    <div {...props}>
      <p
        className={cn(
          'mb-1 font-medium text-fd-muted-foreground text-sm',
          message.role === 'assistant' && 'text-fd-primary'
        )}
      >
        {roleName[message.role] ?? 'unknown'}
      </p>
      <div className='flex flex-col gap-2'>
        <MessageMetadata inProgress={isInProgress} parts={parts} />
        {parts.map((part, idx) => {
          if (part.type !== 'text') {
            return null
          }
          return (
            <div className='prose text-sm' key={`${message.id}-text-${idx}`}>
              <Markdown text={part.text} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AISearch({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const chat = useChat({
    id: 'search',
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  return (
    <ClippyProvider draggable={false} agentName='Rover'>
      <Context value={useMemo(() => ({ chat, open, setOpen }), [chat, open])}>
        {children}
      </Context>
    </ClippyProvider>
  )
}

export function AISearchPanel() {
  const { open, setOpen } = use(Context)!
  const chat = useChatContext()

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
            'fixed right-4 bottom-28 z-50 flex max-h-[500px] w-[360px] flex-col overflow-hidden rounded-lg border border-dashed bg-fd-popover text-fd-popover-foreground shadow-lg',
            open ? 'animate-fd-dialog-in' : 'animate-fd-dialog-out'
          )}
        >
          <div className='flex h-full flex-col divide-y divide-dashed divide-border'>
            <Header />
            <List
              className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-3'
              style={{
                maskImage:
                  'linear-gradient(to bottom, transparent, white 1rem, white calc(100% - 1rem), transparent 100%)',
              }}
            >
              <div className='flex flex-col divide-y divide-dashed divide-border'>
                {chat.messages
                  .filter((msg) => msg.role !== 'system')
                  .map((item, idx) => (
                    <Message
                      className='py-4'
                      isInProgress={
                        chat.messages.length - 1 === idx &&
                        (chat.status === 'streaming' ||
                          chat.status === 'submitted')
                      }
                      key={item.id}
                      message={item}
                    />
                  ))}
              </div>
            </List>
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
