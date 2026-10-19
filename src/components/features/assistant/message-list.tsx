'use client'

import { useSound } from '@web-kits/audio/react'
import { type ChatStatus, isToolUIPart } from 'ai'
import { memo, type ReactNode } from 'react'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageHeader,
  MessageResponse,
} from '@/components/ai-elements/message'
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion'
import { Tool, ToolContent, ToolHeader } from '@/components/ai-elements/tool'
import { CopyStateIcon } from '@/components/copy-state-icon'
import { Icons } from '@/components/icons/icons'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import type { ChatUIMessage } from '@/lib/ai/chat/types'
import { copy as copySound, tap } from '@/lib/audio/minimal'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { isChatBusy, useChatContext } from './chat-context'
import { expandedColumn, eyebrow } from './class-names'
import { useAssistantContext } from './context'
import { useAskSimba } from './input'
import { AvatarIcon } from './mascot/avatar-icon'
import { SimbaChip } from './mascot/simba-chip'
import { MessageMetadata, MessagePending } from './message-metadata'
import { ownerName } from './owner-name'
import { CelebratePart } from './tools/celebrate'
import {
  ContactForm,
  ContactFormCanceled,
  ContactFormSent,
  ContactFormSkeleton,
} from './tools/contact-form'
import { NavigatePart } from './tools/navigate'
import { PortfolioPart } from './tools/portfolio'
import type { ToolPart } from './tools/types'

function SimbaTurn({ children }: { children: ReactNode }) {
  return (
    <Message className='mt-4 first:mt-0' from='assistant'>
      <MessageHeader className='sr-only'>Simba</MessageHeader>
      <MessageContent className='grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-2.5'>
        <SimbaChip className='mx-0 mt-0 size-5 translate-y-0' />
        {children}
      </MessageContent>
    </Message>
  )
}

function ReplyError() {
  const { regenerate } = useChatContext()
  const playRetry = useSound(tap)

  return (
    <SimbaTurn>
      <p className='col-start-2 text-destructive text-sm' role='alert'>
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
    </SimbaTurn>
  )
}

const suggestions = [
  { icon: <Icons.work />, text: 'show me his projects' },
  { icon: <Icons.wrench />, text: "what's his stack" },
  { icon: <Icons.mail />, text: 'how do i reach him' },
]

function SuggestedQuestions() {
  const { context } = useAssistantContext()
  const ask = useAskSimba()

  if (context) {
    return null
  }

  return (
    <Suggestions aria-label='Suggested questions' className='pt-1' role='group'>
      {suggestions.map(({ icon, text }, index) => (
        <Suggestion
          className={cn(
            index === 0 && 'border-primary/50 text-primary [&_svg]:text-primary'
          )}
          key={text}
          onClick={ask}
          suggestion={text}
        >
          {icon}
          {text}
        </Suggestion>
      ))}
    </Suggestions>
  )
}

function ReplyActions({ canCopy }: { canCopy: boolean }) {
  const { regenerate } = useChatContext()
  const playCopy = useSound(copySound)
  const playRegenerate = useSound(tap)
  const { copy, state } = useCopyToClipboard({
    onCopyError: () => toast.error("Couldn't copy that reply."),
    onCopySuccess: () => playCopy(),
  })

  return (
    <MessageActions className='col-start-2 -ml-1.5 opacity-0 pointer-coarse:opacity-100 transition-opacity duration-150 ease-out-strong group-focus-within/message:opacity-100 group-hover/message:opacity-100'>
      {canCopy ? (
        <MessageAction
          label={state === 'done' ? 'Copied' : 'Copy'}
          // Copies the rendered reply so markdown syntax stays out of the clipboard
          onClick={(event) => {
            const replies = event.currentTarget
              .closest('[data-role=assistant]')
              ?.querySelectorAll<HTMLElement>('[data-slot=message-response]')
            copy(
              Array.from(replies ?? [], (reply) => reply.innerText).join('\n\n')
            )
          }}
        >
          <CopyStateIcon className='[&_svg]:size-3.5' state={state} />
        </MessageAction>
      ) : null}
      <MessageAction
        label='Regenerate'
        onClick={() => {
          playRegenerate()
          regenerate()
        }}
      >
        <Icons.refresh className='icon-turn-button' />
      </MessageAction>
      <span aria-live='polite' className='sr-only'>
        {state === 'done' ? 'Copied' : ''}
      </span>
    </MessageActions>
  )
}

export function MessageList({
  messages: allMessages,
  status,
}: {
  messages: ChatUIMessage[]
  status: ChatStatus
}) {
  const isBusy = isChatBusy(status)
  const isAwaitingReply =
    status === 'submitted' && allMessages.at(-1)?.role === 'user'
  const isFailed = status === 'error'
  const lastMessage = allMessages.at(-1)
  const messages =
    isFailed &&
    lastMessage?.role === 'assistant' &&
    !lastMessage.parts.some(
      (part) => part.type === 'text' || isToolUIPart(part)
    )
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
        className={cn('px-3 py-4', expandedColumn)}
        scrollClassName='fd-scroll-container supports-timeline-scroll:scroll-fade-effect-y'
      >
        {messages.length === 0 && !isFailed ? (
          <ConversationEmptyState>
            <AvatarIcon
              className='transition-transform hover:scale-110'
              size={64}
            />
            <p>
              {`heya! im simba, ${ownerName}'s dog. i can answer questions about him, his work, or the site.`}
            </p>
            <SuggestedQuestions />
          </ConversationEmptyState>
        ) : (
          messages.map((item, idx) => (
            <AssistantMessage
              isInProgress={messages.length - 1 === idx && isBusy}
              key={item.id}
              message={item}
              showActions={
                messages.length - 1 === idx &&
                item.role === 'assistant' &&
                status === 'ready'
              }
            />
          ))
        )}
        {isAwaitingReply ? (
          <SimbaTurn>
            <div className='col-start-2'>
              <MessagePending />
            </div>
          </SimbaTurn>
        ) : null}
        {isFailed ? <ReplyError /> : null}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  )
}

const contactFormStatus = (part: ToolPart<'showContactForm'>) => {
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

function ContactFormBody({ part }: { part: ToolPart<'showContactForm'> }) {
  if (part.state === 'output-available') {
    const { output } = part
    return output?.success && output.name && output.email && output.message ? (
      <ContactFormSent
        data={{
          email: output.email,
          message: output.message,
          name: output.name,
        }}
      />
    ) : (
      <ContactFormCanceled />
    )
  }
  if (part.state !== 'input-available') {
    return <ContactFormSkeleton />
  }
  return (
    <ContactForm
      prefill={part.input?.prefill ?? undefined}
      toolCallId={part.toolCallId}
    />
  )
}

function ContactFormPart({ part }: { part: ToolPart<'showContactForm'> }) {
  return (
    <Tool defaultOpen>
      <ToolHeader
        icon={<Icons.mail />}
        state={part.state}
        status={contactFormStatus(part)}
        title='contact form'
      />
      <ToolContent>
        <ContactFormBody part={part} />
      </ToolContent>
    </Tool>
  )
}

const AssistantMessage = memo(function AssistantMessage({
  message,
  isInProgress,
  showActions,
}: {
  message: ChatUIMessage
  isInProgress: boolean
  showActions: boolean
}) {
  const { parts } = message

  if (message.role === 'user') {
    const context = parts.find((part) => part.type === 'data-context')?.data
      .text
    return (
      <Message className='mt-6 first:mt-0' from='user'>
        <MessageHeader className='sr-only'>you</MessageHeader>
        <MessageContent>
          {context ? (
            <div className='not-prose rounded-md border border-border border-dashed bg-muted/40 p-2 text-xs'>
              <p className={cn('mb-1', eyebrow)}>Context</p>
              <p className='line-clamp-3 break-words'>{context}</p>
            </div>
          ) : null}
          {parts.map((part, index) =>
            part.type === 'text' ? (
              <p
                className='whitespace-pre-wrap'
                // biome-ignore lint/suspicious/noArrayIndexKey: message parts are rendered in source order and don't expose a stable id
                key={`${message.id}-text-${index}`}
              >
                {part.text}
              </p>
            ) : null
          )}
        </MessageContent>
      </Message>
    )
  }

  return (
    <SimbaTurn>
      <div className='col-start-2 empty:hidden'>
        <MessageMetadata inProgress={isInProgress} parts={parts} />
      </div>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return (
            <MessageResponse
              className='col-start-2'
              // biome-ignore lint/suspicious/noArrayIndexKey: message parts are rendered in source order and don't expose a stable id
              key={`${message.id}-text-${index}`}
            >
              {part.text}
            </MessageResponse>
          )
        }
        if (part.type === 'tool-showContactForm') {
          return (
            <div className='col-start-2' key={part.toolCallId}>
              <ContactFormPart part={part} />
            </div>
          )
        }
        if (part.type === 'tool-celebrate') {
          return (
            <div className='col-start-2 empty:hidden' key={part.toolCallId}>
              <CelebratePart part={part} />
            </div>
          )
        }
        if (part.type === 'tool-navigate') {
          return (
            <div className='col-start-2 empty:hidden' key={part.toolCallId}>
              <NavigatePart part={part} />
            </div>
          )
        }
        if (part.type === 'tool-renderPortfolio') {
          return (
            <div className='col-start-2' key={part.toolCallId}>
              <PortfolioPart part={part} />
            </div>
          )
        }
        return null
      })}
      {showActions ? (
        <ReplyActions
          canCopy={parts.some(
            (part) => part.type === 'text' && part.text.trim().length > 0
          )}
        />
      ) : null}
    </SimbaTurn>
  )
})
