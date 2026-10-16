'use client'

import type { UseChatHelpers } from '@ai-sdk/react'
import { useChat } from '@ai-sdk/react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { useSound } from '@web-kits/audio/react'
import { DefaultChatTransport, getStaticToolName, isStaticToolUIPart } from 'ai'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { createContext, memo, use, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import type { MyUIMessage } from '@/app/api/chat/types'
import { contextDataSchema } from '@/app/api/chat/types'
import {
  getToolsRequiringConfirmation,
  type ToolName,
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
  useMascotTools,
} from '@/components/features/assistant/mascot/hooks'
import {
  ContactForm,
  ContactFormSkeleton,
} from '@/components/features/assistant/tools/contact-form'
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

// Code-split out of the main bundle by the app provider, so it reads the
// open state and selected context from AssistantProvider
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
              className: 'size-10 rounded-none border-none [&_svg]:size-4',
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
              className: 'size-10 rounded-none border-none [&_svg]:size-4',
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

function AssistantInput() {
  const { setContext, context } = useAssistantContext()
  const { status, sendMessage, stop, messages } = useChatContext()
  const { agent } = useMascot()
  const playSend = useSound(send)
  const toolsRequiringConfirmation = getToolsRequiringConfirmation()
  const [input, setInput] = useState(
    () => localStorage.getItem(assistantInputStorageKey) ?? ''
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
  const isStreaming = status === 'streaming' || status === 'submitted'
  const isLoading = isStreaming || hasPendingToolInput
  const saveInput = useDebounceCallback(
    (value: string) => localStorage.setItem(assistantInputStorageKey, value),
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
    localStorage.removeItem(assistantInputStorageKey)

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
          autoFocus
          className={cn(isLoading && 'text-muted-foreground')}
          id='nd-ai-input'
          onChange={(event) => handleInputChange(event.target.value)}
          placeholder={isLoading ? 'Sniffing for answers...' : 'Ask Simba'}
          value={input}
        />
        <div className='flex h-10 shrink-0 items-center pe-1.5'>
          <PromptInputSubmit
            disabled={
              !isStreaming &&
              ((input.trim().length === 0 && !context) || hasPendingToolInput)
            }
            onStop={stop}
            status={status}
          />
        </div>
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <RegenerateButton />
        </PromptInputTools>
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

function MessageList({
  messages,
  status,
}: {
  messages: MyUIMessage[]
  status: UseChatHelpers<MyUIMessage>['status']
}) {
  const isBusy = status === 'streaming' || status === 'submitted'
  // No assistant message exists before the first chunk, so show a placeholder
  const isAwaitingReply =
    status === 'submitted' && messages.at(-1)?.role === 'user'

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
        {messages.length === 0 ? (
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
          return null
        })}
      </MessageContent>
    </Message>
  )
})

function AssistantPanel() {
  const { open, setOpen } = useAssistantContext()
  const chat = useChatContext()
  const { agent } = useMascot()

  useMascotPanel({
    agent,
    messages: chat.messages,
    open,
    status: chat.status,
  })
  useMascotTools(chat.messages)

  // Non-modal so the page stays usable beside the panel on desktop. Pointer
  // dismissal is off because the backdrop (below lg) and the close button
  // own closing, and Base UI keeps both mounted until their exit animations end
  return (
    <DialogPrimitive.Root
      disablePointerDismissal
      modal={false}
      onOpenChange={setOpen}
      open={open}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className='fixed inset-0 z-30 bg-fd-overlay backdrop-blur-xs data-closed:animate-fd-fade-out data-open:animate-fd-fade-in lg:hidden'
          onClick={() => setOpen(false)}
        />
        <DialogPrimitive.Popup
          aria-label='Ask Simba'
          className='fixed inset-x-4 top-4 bottom-5 z-50 flex flex-col overflow-hidden rounded-lg border border-dashed bg-fd-popover text-fd-popover-foreground shadow-lg outline-none data-closed:animate-fd-dialog-out data-open:animate-fd-dialog-in sm:inset-x-auto sm:top-auto sm:right-4 sm:bottom-28 sm:h-[500px] sm:w-[360px]'
          // The panel plays its own send, error and action sounds
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
