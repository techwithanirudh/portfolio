'use client'

import { PawPrint } from 'lucide-react'
import type { ComponentProps } from 'react'
import { useEffect, useRef } from 'react'
import type { MyUIMessage } from '@/app/api/chat/types'
import { cn } from '@/lib/utils'
import { Markdown } from './markdown'
import { MessageMetadata } from './message-metadata'

const roleName: Record<string, string> = {
  user: 'you',
  assistant: 'assistant',
}

export function MessageList({
  messages,
  status,
  className,
  style,
}: {
  messages: MyUIMessage[]
  status: string
} & ComponentProps<'div'>) {
  return (
    <List className={className} style={style}>
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
    </List>
  )
}

function Message({
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
          if (part.type !== 'text') {
            return null
          }
          return (
            <div className='prose text-sm' key={`${message.id}-text-${idx}`}>
              <Markdown text={part.text} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function List(props: Omit<ComponentProps<'div'>, 'dir'>) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    function callback() {
      const container = containerRef.current
      if (!container) {
        return
      }

      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100

      if (isNearBottom) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'instant',
        })
      }
    }

    const observer = new ResizeObserver(callback)
    callback()

    const element = containerRef.current?.firstElementChild

    if (element) {
      observer.observe(element)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      {...props}
      className={cn(
        'fd-scroll-container flex min-w-0 flex-col overflow-y-auto',
        props.className
      )}
      data-lenis-prevent
    >
      {props.children}
    </div>
  )
}
