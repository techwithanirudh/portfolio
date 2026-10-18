'use client'

import type { UIMessage } from 'ai'
import { type ComponentProps, memo } from 'react'
import { cn } from '@/lib/utils'
import { Markdown } from './markdown'

// TODO(slopradar): unused-export: the exported *Props types in this file have no importers, un-export them (x4)
export type MessageProps = ComponentProps<'div'> & {
  from: UIMessage['role']
}

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      'group/message flex w-full flex-col gap-1',
      // TODO(slopradar): duplicated-state: the role is set as an is-* class and as data-role, style with group-data-[role=assistant]/message in MessageHeader and drop the class
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
      'font-medium text-muted-foreground text-sm',
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

export const MessageResponse = memo(
  ({ className, children, ...props }: MessageResponseProps) => (
    <div
      className={cn(
        'prose prose-a:link-underline min-w-0 prose-a:font-normal text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
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
