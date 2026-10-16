'use client'

import type { UseChatHelpers } from '@ai-sdk/react'
import { useChat } from '@ai-sdk/react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { useSound } from '@web-kits/audio/react'
import {
  DefaultChatTransport,
  getStaticToolName,
  isStaticToolUIPart,
  isToolUIPart,
} from 'ai'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { useLenis } from 'lenis/react'
import { createContext, memo, use, useEffect, useState } from 'react'
import { useDebounceCallback, useMediaQuery, useScrollLock } from 'usehooks-ts'
import type { MyUIMessage } from '@/app/api/chat/types'
import { contextDataSchema } from '@/app/api/chat/types'
import {
  type ToolName,
  toolConfirmationMap,
} from '@/app/api/chat/utils/tools/confirmation'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import {
  Message,
  MessageContent,
  MessageHeader,
  MessageResponse,
} from '@/components/ai-elements/message'
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input'
import { Tool, ToolContent, ToolHeader } from '@/components/ai-elements/tool'
import { useAssistantContext } from '@/components/features/assistant/context'
import {
  MascotProvider,
  useMascot,
} from '@/components/features/assistant/mascot'
import { AvatarIcon } from '@/components/features/assistant/mascot/avatar-icon'
import {
  playSubmitAnimation,
  useMascotPanel,
} from '@/components/features/assistant/mascot/hooks'
import {
  ContactForm,
  ContactFormSkeleton,
} from '@/components/features/assistant/tools/contact-form'
import { NavigatePart } from '@/components/features/assistant/tools/navigate'
import { AssistantTrigger } from '@/components/features/assistant/trigger'
import { Icons } from '@/components/icons/icons'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  deleteSound,
  error as errorSound,
  send,
  success,
  tap,
  toggleOn,
} from '@/lib/audio/minimal'
import { cn } from '@/lib/utils'
import { MessageMetadata, MessagePending } from './message-metadata'

const ChatContext = createContext<UseChatHelpers<MyUIMessage> | null>(null)

export function useChatContext() {
  const ctx = use(ChatContext)
  if (!ctx) {
    throw new Error('useChatContext must be used within Assistant')
  }
  return ctx
}

export function Assistant() {
  const isMobile = useIsMobile()
  const playError = useSound(errorSound)
  const playSuccess = useSound(success)
  const playDelete = useSound(deleteSound)
  const chat = useChat<MyUIMessage>({
    id: 'search',
    onError: () => playError(),
    onFinish: ({ isAbort, isDisconnect, isError }) => {
      if (isAbort) {
        playDelete()
        return
      }
      if (!(isDisconnect || isError)) {
        playSuccess()
      }
    },
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  return (
    <MascotProvider disabled={isMobile}>
      <ChatContext value={chat}>
        <AssistantPanel />
        <AssistantTrigger />
      </ChatContext>
    </MascotProvider>
  )
}

function Header() {
  const { setOpen, setContext } = useAssistantContext()
  const chat = useChatContext()
  const playNewChat = useSound(toggleOn)

  return (
    <div className='sticky top-0 flex h-10 items-stretch'>
      <div className='flex min-w-0 flex-1 items-center gap-2 bg-fd-card px-3 text-fd-card-foreground'>
        <AvatarIcon size={24} />
        <span className='font-medium text-sm'>Ask Simba</span>
      </div>

      <div className='flex h-full'>
        <button
          aria-label='New chat'
          className={cn(
            buttonVariants({
              className:
                'group/button size-10 rounded-none border-none [&_svg]:size-4',
              color: 'secondary',
              size: 'icon-sm',
            })
          )}
          onClick={() => {
            playNewChat()
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
              className:
                'group/button size-10 rounded-none border-none [&_svg]:size-4',
              color: 'primary',
              size: 'icon-sm',
            })
          )}
          onClick={() => setOpen(false)}
          type='button'
        >
          <Icons.close className='icon-turn-button' />
        </button>
      </div>
    </div>
  )
}

function RegenerateButton() {
  const { messages, status, regenerate } = useChatContext()
  const isLoading = status === 'streaming'
  const canShow =
    !isLoading && messages.length > 0 && messages.at(-1)?.role === 'assistant'
  const playRegenerate = useSound(tap)

  return (
    <PromptInputButton
      aria-hidden={!canShow}
      aria-label='Regenerate response'
      className={cn(
        'transition-opacity duration-200',
        canShow ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      disabled={!canShow}
      onClick={() => {
        playRegenerate()
        regenerate()
      }}
      tabIndex={canShow ? 0 : -1}
    >
      <Icons.refresh className='icon-turn-button' />
    </PromptInputButton>
  )
}

const assistantInputStorageKey = '__ai_search_input'
const MaxSourcePreviewChars = 120

// Storage access throws when site data is blocked (Safari "Block all cookies")
const readSavedInput = () => {
  try {
    return localStorage.getItem(assistantInputStorageKey) ?? ''
  } catch {
    return ''
  }
}

const writeSavedInput = (value: string | null) => {
  try {
    if (value === null) {
      localStorage.removeItem(assistantInputStorageKey)
    } else {
      localStorage.setItem(assistantInputStorageKey, value)
    }
  } catch {
    // Without storage the draft just isn't kept
  }
}

function AssistantInput() {
  const { setContext, context } = useAssistantContext()
  const { status, sendMessage, stop, messages } = useChatContext()
  const { agent } = useMascot()
  const playSend = useSound(send)
  const finePointer = useMediaQuery('(pointer: fine)')
  const [input, setInput] = useState(readSavedInput)
  const hasPendingToolInput = messages.some((message) =>
    message.parts?.some((part) => {
      if (!isStaticToolUIPart(part) || part.state !== 'input-available') {
        return false
      }
      return toolConfirmationMap[getStaticToolName(part) as ToolName]
    })
  )
  const isStreaming = status === 'streaming' || status === 'submitted'
  const isLoading = isStreaming || hasPendingToolInput
  const saveInput = useDebounceCallback(
    (value: string) => writeSavedInput(value),
    300
  )

  const onStart = async () => {
    if (isLoading) {
      return
    }
    const trimmedInput = input.trim()
    if (trimmedInput.length === 0 && !context) {
      return
    }

    const contextValue = context?.trim()
    const messageText =
      trimmedInput.length > 0 ? trimmedInput : 'Use the provided context.'

    playSubmitAnimation(agent)
    playSend()

    setInput('')
    setContext(null)
    saveInput.cancel()
    writeSavedInput(null)

    await sendMessage({
      parts: [
        {
          data: {
            location: window.location.href,
          },
          type: 'data-client',
        },
        {
          text: messageText,
          type: 'text',
        },
        ...(contextValue
          ? [
              {
                data: {
                  text: contextValue,
                },
                type: 'data-context' as const,
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

  return (
    <PromptInput onSubmit={onStart}>
      {context ? (
        <PromptInputHeader>
          <PromptContext context={context} onClear={() => setContext(null)} />
        </PromptInputHeader>
      ) : null}
      <PromptInputBody>
        <PromptInputTextarea
          aria-label='Ask Simba a question'
          autoFocus={finePointer}
          className={cn('min-h-16', isLoading && 'text-muted-foreground')}
          id='nd-ai-input'
          onChange={(event) => handleInputChange(event.target.value)}
          placeholder={isLoading ? 'Sniffing for answers...' : 'Ask Simba'}
          value={input}
        />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <RegenerateButton />
        </PromptInputTools>
        <PromptInputSubmit
          disabled={
            !isStreaming &&
            ((input.trim().length === 0 && !context) || hasPendingToolInput)
          }
          onStop={stop}
          status={status}
        />
      </PromptInputFooter>
    </PromptInput>
  )
}

function PromptContext({
  context,
  onClear,
}: {
  context: string
  onClear: () => void
}) {
  return (
    <div className='flex w-full items-start gap-1.5 bg-fd-background px-2 py-1.5 font-normal text-foreground text-xs'>
      <Icons.quote
        aria-hidden
        className='mt-0.5 size-3 shrink-0 text-muted-foreground'
      />
      <span className='line-clamp-2 flex-1 break-words'>
        <span className='sr-only'>Context: </span>
        {context.slice(0, MaxSourcePreviewChars)}
      </span>
      <button
        aria-label='Remove context'
        className='inline-flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground'
        onClick={onClear}
        type='button'
      >
        <Icons.close className='size-3.5' />
      </button>
    </div>
  )
}

const roleName: Record<string, string> = {
  assistant: 'assistant',
  user: 'you',
}

const hasReplyContent = (message: MyUIMessage) =>
  message.parts.some((part) => part.type === 'text' || isToolUIPart(part))

function ReplyError() {
  const { regenerate } = useChatContext()
  const playRetry = useSound(tap)

  return (
    <Message className='py-4' from='assistant'>
      <MessageHeader>{roleName.assistant}</MessageHeader>
      <p className='text-destructive text-sm' role='alert'>
        Simba lost the scent.{' '}
        <button
          className='link-underline'
          onClick={() => {
            playRetry()
            regenerate()
          }}
          type='button'
        >
          Try again
        </button>
      </p>
    </Message>
  )
}

function MessageList({
  messages: allMessages,
  status,
}: {
  messages: MyUIMessage[]
  status: UseChatHelpers<MyUIMessage>['status']
}) {
  const isBusy = status === 'streaming' || status === 'submitted'
  // No assistant message exists before the first chunk, so show a placeholder
  const isAwaitingReply =
    status === 'submitted' && allMessages.at(-1)?.role === 'user'
  const isFailed = status === 'error'
  const lastMessage = allMessages.at(-1)
  // A failed call can leave an empty assistant message; the error stands in for it
  const messages =
    isFailed &&
    lastMessage?.role === 'assistant' &&
    !hasReplyContent(lastMessage)
      ? allMessages.slice(0, -1)
      : allMessages

  return (
    <Conversation
      aria-busy={isBusy}
      aria-label='Conversation with Simba'
      className='min-h-0 flex-1'
      data-lenis-prevent
    >
      <ConversationContent
        className='divide-y divide-dashed divide-border px-3'
        scrollClassName='fd-scroll-container supports-timeline-scroll:scroll-fade-effect-y'
      >
        {messages.length === 0 && !isFailed ? (
          <ConversationEmptyState>
            <AvatarIcon
              className='transition-transform hover:scale-110'
              size={64}
            />
            <p>
              heya! im simba, anirudh's dog. i can answer questions about him,
              his work, or the site.
            </p>
          </ConversationEmptyState>
        ) : (
          messages.map((item, idx) => (
            <AssistantMessage
              isInProgress={messages.length - 1 === idx && isBusy}
              key={item.id}
              message={item}
            />
          ))
        )}
        {isAwaitingReply ? (
          <Message className='py-4' from='assistant'>
            <MessageHeader>{roleName.assistant}</MessageHeader>
            <MessagePending />
          </Message>
        ) : null}
        {isFailed ? <ReplyError /> : null}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  )
}

const contactFormStatus = (
  part: Extract<MyUIMessage['parts'][number], { type: 'tool-showContactForm' }>
) => {
  if (part.state === 'output-available') {
    return part.output?.success ? 'sent' : 'canceled'
  }
  if (part.state === 'input-available') {
    return 'waiting on you'
  }
  if (part.state === 'input-streaming') {
    return 'drafting'
  }
}

function ContactFormPart({
  part,
}: {
  part: Extract<MyUIMessage['parts'][number], { type: 'tool-showContactForm' }>
}) {
  const isSubmitted = part.state === 'output-available'
  const submittedData =
    isSubmitted &&
    part.output?.success &&
    part.output.name &&
    part.output.email &&
    part.output.message
      ? {
          email: part.output.email,
          message: part.output.message,
          name: part.output.name,
        }
      : undefined

  return (
    <Tool defaultOpen>
      <ToolHeader
        icon={<Icons.mail />}
        state={part.state}
        status={contactFormStatus(part)}
        title='contact form'
      />
      <ToolContent>
        {!isSubmitted && part.state !== 'input-available' ? (
          <ContactFormSkeleton />
        ) : (
          <ContactForm
            isSubmitted={isSubmitted}
            prefill={part.input?.prefill ?? undefined}
            submittedData={submittedData}
            toolCallId={part.toolCallId}
          />
        )}
      </ToolContent>
    </Tool>
  )
}

const AssistantMessage = memo(function AssistantMessage({
  message,
  isInProgress,
}: {
  message: MyUIMessage
  isInProgress: boolean
}) {
  const parts = (message.parts ?? []) as MyUIMessage['parts']
  const context = (() => {
    const contextPart = parts.find((part) => part.type === 'data-context')
    if (!(contextPart && 'data' in contextPart)) {
      return
    }
    return contextDataSchema.safeParse(contextPart.data).data?.text
  })()

  return (
    <Message className='py-4' from={message.role}>
      <MessageHeader>{roleName[message.role] ?? 'unknown'}</MessageHeader>
      <MessageContent>
        {message.role === 'user' && context ? (
          <div className='not-prose rounded-md border border-border border-dashed bg-fd-muted/40 p-2 text-xs'>
            <p className='mb-1 font-medium text-[11px] text-muted-foreground uppercase tracking-wide'>
              Context
            </p>
            <p className='line-clamp-3 break-words'>{context}</p>
          </div>
        ) : null}
        <MessageMetadata inProgress={isInProgress} parts={parts} />
        {parts.map((part, index) => {
          if (part.type === 'text') {
            return (
              <MessageResponse
                // biome-ignore lint/suspicious/noArrayIndexKey: message parts are rendered in source order and don't expose a stable id
                key={`${message.id}-text-${index}`}
              >
                {part.text}
              </MessageResponse>
            )
          }
          if (part.type === 'tool-showContactForm') {
            return <ContactFormPart key={part.toolCallId} part={part} />
          }
          if (part.type === 'tool-navigate') {
            return <NavigatePart key={part.toolCallId} part={part} />
          }
          return null
        })}
      </MessageContent>
    </Message>
  )
})

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

function AssistantPanel() {
  const { open, setOpen } = useAssistantContext()
  const chat = useChatContext()
  const { agent } = useMascot()
  const isDocked = useMediaQuery('(min-width: 64rem)')

  useMascotPanel({
    agent,
    messages: chat.messages,
    open,
    status: chat.status,
  })

  return (
    <DialogPrimitive.Root
      disablePointerDismissal
      modal={false}
      onOpenChange={setOpen}
      open={open}
    >
      {open && !isDocked ? <PageScrollLock /> : null}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className='fixed inset-0 z-30 touch-none bg-fd-overlay backdrop-blur-xs transition-opacity duration-200 ease-out-strong data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-150 lg:hidden'
          onClick={() => setOpen(false)}
        />
        <DialogPrimitive.Popup
          aria-label='Ask Simba'
          className='fixed inset-x-4 top-[max(1rem,env(safe-area-inset-top))] bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50 flex origin-bottom flex-col overflow-hidden rounded-lg border border-dashed bg-fd-popover text-fd-popover-foreground shadow-lg outline-none transition-[opacity,scale] duration-200 ease-out-strong data-ending-style:scale-96 data-starting-style:scale-96 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-150 sm:inset-x-auto sm:top-auto sm:right-[max(1rem,env(safe-area-inset-right))] sm:bottom-28 sm:h-[min(500px,calc(100dvh-8rem))] sm:w-[360px] sm:origin-bottom-right sm:[@media(max-height:640px)]:bottom-[max(1rem,env(safe-area-inset-bottom))] sm:[@media(max-height:640px)]:h-[calc(100dvh-2rem)]'
          data-sound-press='off'
        >
          <div className='flex h-full flex-col divide-y divide-dashed divide-border'>
            <Header />
            <MessageList messages={chat.messages} status={chat.status} />
            <div className='border-t border-dashed bg-fd-card text-fd-card-foreground has-focus-visible:ring-2 has-focus-visible:ring-fd-ring'>
              <AssistantInput />
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
