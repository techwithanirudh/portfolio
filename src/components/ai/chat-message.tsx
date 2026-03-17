'use client'

import type { ComponentProps } from 'react'
import { memo } from 'react'
import type { MyUIMessage } from '@/app/api/chat/types'
import {
  AIContactForm,
  AIContactFormSkeleton,
} from '@/components/ai/tools/contact-form'
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'
import { cn } from '@/lib/utils'
import { MessageMetadata } from './message-metadata'

const roleName: Record<string, string> = {
  user: 'you',
  assistant: 'assistant',
}

export type ChatMessageProps = {
  message: MyUIMessage
  isInProgress: boolean
  isLastMessage: boolean
} & ComponentProps<'div'>

function MessageParts({ message }: { message: MyUIMessage }) {
  const parts = (message.parts ?? []) as MyUIMessage['parts']

  return (
    <>
      {parts.map((part, i) => {
        if (part.type === 'text') {
          return (
            <MessageResponse key={`${message.id}-${i}`}>
              {part.text}
            </MessageResponse>
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
    </>
  )
}

export const ChatMessage = memo(function ChatMessage({
  message,
  isInProgress,
  isLastMessage: _isLastMessage,
  ...props
}: ChatMessageProps) {
  const parts = (message.parts ?? []) as MyUIMessage['parts']

  return (
    <Message
      {...props}
      className={cn('max-w-full gap-0.5 py-4', props.className)}
      from={message.role}
    >
      <p
        className={cn(
          'mb-1 font-medium text-fd-muted-foreground text-sm',
          message.role === 'assistant' && 'text-fd-primary'
        )}
      >
        {roleName[message.role] ?? 'unknown'}
      </p>
      <MessageContent className='max-w-full bg-transparent p-0 text-fd-foreground'>
        <MessageMetadata inProgress={isInProgress} parts={parts} />
        {message.role === 'assistant' ? (
          <MessageParts message={message} />
        ) : (
          parts.map((part, idx) => {
            if (part.type !== 'text') {
              return null
            }
            return (
              <div className='prose text-sm' key={`${message.id}-text-${idx}`}>
                {part.text}
              </div>
            )
          })
        )}
      </MessageContent>
    </Message>
  )
})
