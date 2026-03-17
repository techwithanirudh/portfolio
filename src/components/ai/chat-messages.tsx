'use client'

import { PawPrint } from 'lucide-react'
import { useMemo } from 'react'
import type { MyUIMessage } from '@/app/api/chat/types'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { ChatMessage } from './chat-message'

export interface ChatMessagesProps {
  messages: MyUIMessage[]
  status: string
}

export function ChatMessages({ messages, status }: ChatMessagesProps) {
  const panelStyle = useMemo(
    () => ({
      maskImage:
        'linear-gradient(to bottom, transparent, white 1rem, white calc(100% - 1rem), transparent 100%)',
    }),
    []
  )

  return (
    <Conversation
      className='fd-scroll-container min-h-0 flex-1'
      data-lenis-prevent
      style={panelStyle}
    >
      <ConversationContent className='gap-0 divide-y divide-dashed divide-border px-1 py-0 flex-1 min-h-full'>
        {messages.length === 0 ? (
          <ConversationEmptyState
            className='text-fd-muted-foreground text-sm min-h-full flex-1'
            description="heya! im simba, anirudh's dog. i can answer questions about him, his work, or the site."
            icon={
              <PawPrint className='size-8 text-fd-primary transition-transform hover:-rotate-45 hover:scale-125' />
            }
            title=''
          />
        ) : (
          messages.map((item, idx) => (
            <ChatMessage
              isInProgress={
                messages.length - 1 === idx &&
                (status === 'streaming' || status === 'submitted')
              }
              key={item.id}
              message={item}
            />
          ))
        )}
      </ConversationContent>
      <ConversationScrollButton className='rounded-none border border-dashed' />
    </Conversation>
  )
}
