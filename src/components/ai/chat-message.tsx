'use client'

import type { UIMessage } from 'ai'
import type { ComponentProps } from 'react'
import { memo } from 'react'
import type { MyUIMessage } from '@/app/api/chat/types'
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message'
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning'
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

function MessageParts({
  message,
  isLastMessage,
  isStreaming,
}: {
  message: MyUIMessage
  isLastMessage: boolean
  isStreaming: boolean
}) {
  const parts = (message.parts ?? []) as MyUIMessage['parts']

  // Consolidate all reasoning parts into one block
  const reasoningParts = parts.filter(
    (part): part is Extract<UIMessage['parts'][number], { type: 'reasoning' }> =>
      part.type === 'reasoning'
  )
  const reasoningText = reasoningParts.map((part) => part.text).join('\n\n')
  const hasReasoning = reasoningParts.length > 0

  // Check if reasoning is still streaming (last part is reasoning on last message)
  const lastPart = parts.at(-1)
  const isReasoningStreaming =
    isLastMessage && isStreaming && lastPart?.type === 'reasoning'

  return (
    <>
      {hasReasoning && (
        <Reasoning className='w-full' isStreaming={isReasoningStreaming}>
          <ReasoningTrigger />
          <ReasoningContent>{reasoningText}</ReasoningContent>
        </Reasoning>
      )}
      {parts.map((part, i) => {
        if (part.type === 'text') {
          return (
            <MessageResponse key={`${message.id}-${i}`}>
              {part.text}
            </MessageResponse>
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
  isLastMessage,
  ...props
}: ChatMessageProps) {
  const parts = (message.parts ?? []) as MyUIMessage['parts']
  const isStreaming = isInProgress

  return (
    <Message
      {...props}
      className={cn('max-w-full py-4 gap-0.5', props.className)}
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
          <MessageParts
            isLastMessage={isLastMessage}
            isStreaming={isStreaming}
            message={message}
          />
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
