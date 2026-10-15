'use client'

import type { UIMessage } from 'ai'
import { type ComponentProps, memo } from 'react'
import { cn } from '@/lib/utils'
import { Markdown } from './markdown'

export type MessageProps = ComponentProps<'div'> & {
  from: UIMessage['role']
}

// No bubbles, so `from` only sets data hooks for styling
export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      'group/message flex w-full flex-col gap-1',
      from === 'user' ? 'is-user' : 'is-assistant',
      className
    )}
    data-role={from}
    {...props}
  />
)

export type MessageHeaderProps = ComponentProps<'p'>

export const MessageHeader = ({ className, ...props }: MessageHeaderProps) => (
  <p
    className={cn(
      'font-medium font-mono text-muted-foreground text-xs lowercase',
      'group-[.is-assistant]/message:text-primary',
      className
    )}
    {...props}
  />
)

export type MessageContentProps = ComponentProps<'div'>

export const MessageContent = ({
  className,
  ...props
}: MessageContentProps) => (
  <div
    className={cn('flex min-w-0 flex-col gap-2 text-sm', className)}
    {...props}
  />
)

export type MessageResponseProps = Omit<ComponentProps<'div'>, 'children'> & {
  children: string
}

// The site's own renderer, so replies match the docs
export const MessageResponse = memo(
  ({ className, children, ...props }: MessageResponseProps) => (
    <div
      className={cn(
        'prose min-w-0 text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
        className
      )}
      {...props}
    >
      <Markdown text={children} />
    </div>
  ),
  (prev, next) =>
    prev.children === next.children && prev.className === next.className
)

MessageResponse.displayName = 'MessageResponse'
