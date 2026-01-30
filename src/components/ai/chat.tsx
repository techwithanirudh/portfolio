'use client'

import type { UseChatHelpers } from '@ai-sdk/react'
import { useChat } from '@ai-sdk/react'
import { Presence } from '@radix-ui/react-presence'
import { DefaultChatTransport, isToolUIPart } from 'ai'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import {
  ArrowUpIcon,
  PawPrint,
  PlusIcon,
  RefreshCw,
  SquareIcon,
  X,
} from 'lucide-react'
import {
  type ComponentProps,
  createContext,
  memo,
  type ReactNode,
  type SyntheticEvent,
  use,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import type { MyUIMessage } from '@/app/api/chat/types'
import { AIContactForm } from '@/components/ai/tools/contact-form'
import {
  AGENTS,
  animations,
  ClippyProvider,
  useClippy,
} from '@/components/clippy'
import { cn } from '@/lib/utils'
import { Markdown } from './markdown'
import { MessageMetadata } from './message-metadata'

const AISearchContext = createContext<{
  open: boolean
  setOpen: (open: boolean) => void
  chat: UseChatHelpers<MyUIMessage>
} | null>(null)

export function useAISearchContext() {
  const ctx = use(AISearchContext)
  if (!ctx) {
    throw new Error('useAISearchContext must be used within AISearch')
  }
  return ctx
}

export function useChatContext() {
  const ctx = use(AISearchContext)
  if (!ctx) {
    throw new Error('useChatContext must be used within AISearch')
  }
  return ctx.chat
}

export function AISearch({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const chat = useChat<MyUIMessage>({
    id: 'search',
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  return (
    <ClippyProvider agentName={AGENTS.ROVER} draggable={false}>
      <AISearchContext
        value={useMemo(() => ({ chat, open, setOpen }), [chat, open])}
      >
        {children}
        <AISearchPanel />
      </AISearchContext>
    </ClippyProvider>
  )
}

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

const StorageKeyInput = '__ai_search_input'

function SearchAIInput(props: ComponentProps<'form'>) {
  const { status, sendMessage, stop } = useChatContext()
  const { clippy } = useClippy()
  const [input, setInput] = useState(
    () => localStorage.getItem(StorageKeyInput) ?? ''
  )
  const isLoading = status === 'streaming' || status === 'submitted'
  const saveInput = useDebounceCallback(
    (value: string) => localStorage.setItem(StorageKeyInput, value),
    300
  )

  const onStart = async (event?: SyntheticEvent) => {
    event?.preventDefault()
    if (clippy) {
      clippy.stopCurrent()
      clippy.play(animations.submit)
    }
    await sendMessage({ text: input })
    setInput('')
    localStorage.removeItem(StorageKeyInput)
  }

  const handleInputChange = (value: string) => {
    setInput(value)
    saveInput(value)
  }

  useEffect(() => {
    if (isLoading) {
      document.getElementById('nd-ai-input')?.focus()
    }
  }, [isLoading])

  return (
    <form
      {...props}
      className={cn('flex items-start pe-2', props.className)}
      onSubmit={onStart}
    >
      <TextInput
        autoFocus
        className={cn('p-3', isLoading && 'text-fd-muted-foreground')}
        disabled={isLoading}
        onChange={(event) => handleInputChange(event.target.value)}
        onKeyDown={(event) => {
          if (!event.shiftKey && event.key === 'Enter') {
            onStart(event)
          }
        }}
        placeholder={isLoading ? 'Sniffing for answers...' : 'Ask Simba'}
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
          type='submit'
        >
          <ArrowUpIcon />
        </button>
      )}
    </form>
  )
}

function TextInput(props: ComponentProps<'textarea'>) {
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
      <div className={cn(shared, 'invisible break-all')}>
        {`${props.value?.toString() ?? ''}\n`}
      </div>
    </div>
  )
}

const roleName: Record<string, string> = {
  user: 'you',
  assistant: 'assistant',
}

function MessageList({
  messages,
  status,
  className,
  style,
}: {
  messages: MyUIMessage[]
  status: string
} & ComponentProps<'div'>) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const scroll = () => {
      if (!container) {
        return
      }
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100
      if (isNearBottom) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'instant' })
      }
    }

    const observer = new ResizeObserver(scroll)
    scroll()

    const element = container.firstElementChild
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={cn(
        'fd-scroll-container flex min-w-0 flex-col overflow-y-auto',
        className
      )}
      data-lenis-prevent
      ref={containerRef}
      style={style}
    >
      <div className='flex flex-1 flex-col divide-y divide-dashed divide-border'>
        {messages.length === 0 ? (
          <div className='flex min-h-full flex-1 flex-col items-center justify-center gap-3 text-center text-fd-muted-foreground text-sm'>
            <PawPrint className='size-8 text-fd-primary transition-transform hover:-rotate-45 hover:scale-125' />
            <p>
              heya! im simba, anirudh's dog. i can answer questions about him,
              his work, or the site.
            </p>
          </div>
        ) : (
          messages.map((item, idx) => (
            <Message
              className='py-4'
              isInProgress={
                messages.length - 1 === idx &&
                (status === 'streaming' || status === 'submitted')
              }
              key={item.id}
              message={item}
            />
          ))
        )}
      </div>
    </div>
  )
}

const Message = memo(function Message({
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
          if (part.type === 'text') {
            return (
              <div className='prose text-sm' key={`${message.id}-text-${idx}`}>
                <Markdown text={part.text} />
              </div>
            )
          }
          if (part.type === 'tool-showContactForm') {
            const isSubmitted = part.state === 'output-available'
            const output = isSubmitted ? part.output : undefined
            const prefill = part.input?.prefill ?? undefined;
    
            return (
              <AIContactForm
                isSubmitted={isSubmitted}
                key={part.toolCallId}
                prefill={prefill}
                submittedData={
                  output?.success
                    ? {
                        name: output.name,
                        email: output.email,
                        message: output.message,
                      }
                    : undefined
                }
                toolCallId={part.toolCallId}
              />
            )
          }
          return null
        })}
      </div>
    </div>
  )
})

function AISearchPanel() {
  const { open, setOpen } = useAISearchContext()
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

  const panelStyle = useMemo(
    () => ({
      maskImage:
        'linear-gradient(to bottom, transparent, white 1rem, white calc(100% - 1rem), transparent 100%)',
    }),
    []
  )

  return (
    <>
      <Presence present={open}>
        <button
          aria-label='Close AI panel'
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
