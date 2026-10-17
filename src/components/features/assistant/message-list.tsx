'use client'

import type { UseChatHelpers } from '@ai-sdk/react'
import { useSound } from '@web-kits/audio/react'
import { isToolUIPart } from 'ai'
import { memo } from 'react'
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
import { Tool, ToolContent, ToolHeader } from '@/components/ai-elements/tool'
import { Icons } from '@/components/icons/icons'
import { contextDataSchema, type MyUIMessage } from '@/lib/ai/chat/types'
import { tap } from '@/lib/audio/minimal'
import { useChatContext } from './chat-context'
import { AvatarIcon } from './mascot/avatar-icon'
import { MessageMetadata, MessagePending } from './message-metadata'
import { ContactForm, ContactFormSkeleton } from './tools/contact-form'
import { NavigatePart } from './tools/navigate'
import { PortfolioPart } from './tools/portfolio'

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

export function MessageList({
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
        className='dashed-stack px-3'
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
  const { parts } = message
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
          <div className='not-prose rounded-md border border-border border-dashed bg-muted/40 p-2 text-xs'>
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
          if (part.type === 'tool-renderPortfolio') {
            return <PortfolioPart key={part.toolCallId} part={part} />
          }
          return null
        })}
      </MessageContent>
    </Message>
  )
})
