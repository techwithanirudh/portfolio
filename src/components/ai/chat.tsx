'use client'

import type { UseChatHelpers } from '@ai-sdk/react'
import { useChat } from '@ai-sdk/react'
import { Presence } from '@radix-ui/react-presence'
import {
  DefaultChatTransport,
  getStaticToolName,
  isStaticToolUIPart,
  isToolUIPart,
} from 'ai'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { usePathname } from 'next/navigation'
import {
  type ComponentProps,
  createContext,
  type Dispatch,
  memo,
  type ReactNode,
  type SetStateAction,
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
import { contextDataSchema } from '@/app/api/chat/types'
import {
  getToolsRequiringConfirmation,
  type ToolName,
} from '@/app/api/chat/utils/tools/confirmation'
import {
  AIContactForm,
  AIContactFormSkeleton,
} from '@/components/ai/tools/contact-form'
import {
  AGENTS,
  animations,
  ClippyProvider,
  useClippy,
} from '@/components/clippy'
import { Icons } from '@/components/icons/icons'
import { cn } from '@/lib/utils'
import { Markdown } from './markdown'
import { MessageMetadata } from './message-metadata'
import { SelectionContextMenu } from './selection-context-menu'

const AISearchContext = createContext<{
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  chat: UseChatHelpers<MyUIMessage>
  context: string | null
  setContext: Dispatch<SetStateAction<string | null>>
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
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [context, setContext] = useState<string | null>(null)
  const chat = useChat<MyUIMessage>({
    id: 'search',
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          id,
          messages,
          pageContext: {
            pathname,
          },
        },
      }),
    }),
  })

  return (
    <ClippyProvider agentName={AGENTS.ROVER} draggable={false}>
      <AISearchContext
        value={useMemo(
          () => ({
            chat,
            context,
            open,
            setContext,
            setOpen,
          }),
          [chat, context, open]
        )}
      >
        {children}
        <AISearchPanel />
      </AISearchContext>
    </ClippyProvider>
  )
}

function Header() {
  const { setOpen, chat, setContext } = useAISearchContext()

  return (
    <div className='sticky top-0 flex h-10 items-start'>
      <div className='flex min-h-full flex-1 items-center justify-between rounded-none bg-fd-card px-3 py-2 text-fd-card-foreground'>
        <div className='flex items-center gap-2'>
          <Icons.pawPrint className='size-4 text-fd-primary transition-transform duration-200 hover:-rotate-45' />
          <p className='font-medium text-sm'>Ask Simba</p>
        </div>
      </div>

      <div className='flex min-h-full'>
        <button
          className={cn(
            buttonVariants({
              color: 'secondary',
              size: 'icon-sm',
              className: 'w-10 flex-1 rounded-none border-none [&_svg]:size-4',
            })
          )}
          onClick={() => {
            chat.setMessages([])
            setContext(null)
          }}
          type='button'
        >
          <Icons.add className='icon-turn-button' />
        </button>
        <button
          aria-label='Close'
          className={cn(
            buttonVariants({
              size: 'icon-sm',
              color: 'primary',
              className: 'w-10 flex-1 rounded-none border-none [&_svg]:size-4',
            })
          )}
          onClick={() => setOpen(false)}
          tabIndex={-1}
          type='button'
        >
          <Icons.close className='icon-turn-button' />
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
      <Icons.refresh />
    </button>
  )
}

const StorageKeyInput = '__ai_search_input'
const MaxSourcePreviewChars = 120

function SearchAIInput(props: ComponentProps<'form'>) {
  const { status, sendMessage, stop, messages } = useChatContext()
  const { setContext, context } = useAISearchContext()
  const { clippy } = useClippy()
  const toolsRequiringConfirmation = getToolsRequiringConfirmation()
  const [input, setInput] = useState(
    () => localStorage.getItem(StorageKeyInput) ?? ''
  )
  const hasPendingToolInput = messages.some((message) =>
    message.parts?.some((part) => {
      if (!isStaticToolUIPart(part) || part.state !== 'input-available') {
        return false
      }
      const toolName = getStaticToolName(part) as ToolName
      return toolsRequiringConfirmation.includes(toolName)
    })
  )
  const isLoading =
    status === 'streaming' || status === 'submitted' || hasPendingToolInput
  const saveInput = useDebounceCallback(
    (value: string) => localStorage.setItem(StorageKeyInput, value),
    300
  )

  const onStart = async (event?: SyntheticEvent) => {
    event?.preventDefault()
    if (hasPendingToolInput) {
      return
    }
    const trimmedInput = input.trim()
    if (trimmedInput.length === 0 && !context) {
      return
    }

    const contextValue = context?.trim()
    const messageText =
      trimmedInput.length > 0 ? trimmedInput : 'Use the provided context.'

    if (clippy) {
      clippy.stopCurrent()
      clippy.play(animations.submit)
    }

    setInput('')
    setContext(null)
    localStorage.removeItem(StorageKeyInput)

    await sendMessage({
      parts: [
        {
          type: 'text',
          text: messageText,
        },
        ...(contextValue
          ? [
              {
                type: 'data-context' as const,
                data: {
                  text: contextValue,
                },
              },
            ]
          : []),
      ],
    })
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
      className={cn('flex items-start', props.className)}
      onSubmit={onStart}
    >
      <div className='flex flex-1 flex-col'>
        <PromptContext context={context} onClear={() => setContext(null)} />
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
      </div>
      <div
        className={cn('flex h-10 items-center justify-center pe-1.5', {
          'bg-fd-background': context,
        })}
      >
        {isLoading ? (
          <button
            className={cn(
              buttonVariants({
                color: 'secondary',
                size: 'icon-sm',
                className:
                  'rounded-none border border-dashed transition-all [&_svg]:size-3.5',
              })
            )}
            onClick={stop}
            type='button'
          >
            <Icons.square className='fill-fd-foreground' />
          </button>
        ) : (
          <button
            className={cn(
              buttonVariants({
                color: 'primary',
                size: 'icon-sm',
                className:
                  'rounded-none border border-dashed transition-all [&_svg]:size-4',
              })
            )}
            disabled={
              (input.trim().length === 0 && !context) || hasPendingToolInput
            }
            type='submit'
          >
            <Icons.arrowUp />
          </button>
        )}
      </div>
    </form>
  )
}

function PromptContext({
  context,
  onClear,
}: {
  context: string | null
  onClear: () => void
}) {
  if (!context) {
    return null
  }

  return (
    <div className='flex h-10 items-start gap-1.5 bg-fd-background px-2 py-1 text-xs'>
      <Icons.quote className='mt-0.5 size-3 shrink-0 text-fd-muted-foreground' />
      <span className='line-clamp-2 flex-1 break-words'>
        {context.slice(0, MaxSourcePreviewChars)}
      </span>
      <button
        aria-label='Remove context'
        className='inline-flex items-center justify-center rounded-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground'
        onClick={onClear}
        type='button'
      >
        <Icons.close className='size-3.5' />
      </button>
    </div>
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
            <Icons.pawPrint className='size-8 text-fd-primary transition-transform hover:-rotate-45 hover:scale-125' />
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
  const context = (() => {
    const contextPart = parts.find((part) => part.type === 'data-context')
    if (!(contextPart && 'data' in contextPart)) {
      return undefined
    }
    return contextDataSchema.safeParse(contextPart.data).data?.text
  })()

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
        {message.role === 'user' && context ? (
          <div className='not-prose rounded-md border border-border border-dashed bg-fd-muted/40 p-2 text-xs'>
            <p className='mb-1 font-medium text-[11px] text-fd-muted-foreground uppercase tracking-wide'>
              Context
            </p>
            <p className='line-clamp-3 break-words'>{context}</p>
          </div>
        ) : null}
        <MessageMetadata inProgress={isInProgress} parts={parts} />
        {parts.map((part, index) => {
          if (part.type === 'text') {
            return (
              <div
                className='prose text-sm'
                key={`${message.id}-text-${index}`}
              >
                <Markdown text={part.text} />
              </div>
            )
          }
          if (part.type === 'tool-showContactForm') {
            const isSubmitted = part.state === 'output-available'
            const submittedData =
              isSubmitted &&
              part.output?.success &&
              part.output.name &&
              part.output.email &&
              part.output.message
                ? {
                    name: part.output.name,
                    email: part.output.email,
                    message: part.output.message,
                  }
                : undefined

            if (!isSubmitted && part.state !== 'input-available') {
              return <AIContactFormSkeleton key={part.toolCallId} />
            }

            return (
              <AIContactForm
                isSubmitted={isSubmitted}
                key={part.toolCallId}
                prefill={part.input?.prefill ?? undefined}
                submittedData={submittedData}
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
  const { setContext, open, setOpen } = useAISearchContext()
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
      <SelectionContextMenu
        onSelect={(text) => {
          const normalized = text.trim()
          if (!normalized) {
            return
          }
          setContext(normalized)
          setOpen(true)
        }}
      />
    </>
  )
}
