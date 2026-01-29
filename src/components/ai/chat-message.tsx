'use client'

import type { ComponentProps } from 'react'
import { memo } from 'react'
import type { MyUIMessage } from '@/app/api/chat/types'
import { Message, MessageContent } from '@/components/ai-elements/message'
import { cn } from '@/lib/utils'
import { Markdown } from './markdown'
import { MessageMetadata } from './message-metadata'

const roleName: Record<string, string> = {
  user: 'you',
  assistant: 'assistant',
}

export type ChatMessageProps = {
  message: MyUIMessage
  isInProgress: boolean
} & ComponentProps<'div'>

export const ChatMessage = memo(function ChatMessage({
  message,
  isInProgress,
  ...props
}: ChatMessageProps) {
  const parts = (message.parts ?? []) as MyUIMessage['parts']

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
      </MessageContent>
    </Message>
  )
})
