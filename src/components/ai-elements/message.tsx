'use client'

import type { UIMessage } from 'ai'
import { type ComponentProps, memo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Markdown } from './markdown'

type MessageProps = ComponentProps<'div'> & {
  from: UIMessage['role']
}

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      'group/message flex w-full flex-col gap-1 data-[role=user]:items-end',
      className
    )}
    data-role={from}
    {...props}
  />
)

type MessageHeaderProps = ComponentProps<'p'>

export const MessageHeader = ({ className, ...props }: MessageHeaderProps) => (
  <p
    className={cn(
      'font-medium text-muted-foreground text-sm',
      'group-data-[role=assistant]/message:text-primary',
      className
    )}
    {...props}
  />
)

type MessageContentProps = ComponentProps<'div'>

export const MessageContent = ({
  className,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(
      'flex min-w-0 flex-col gap-2 text-sm',
      'group-data-[role=user]/message:wrap-anywhere group-data-[role=user]/message:max-w-[80%] group-data-[role=user]/message:rounded-lg group-data-[role=user]/message:bg-secondary group-data-[role=user]/message:px-3 group-data-[role=user]/message:py-2',
      className
    )}
    {...props}
  />
)

type MessageResponseProps = Omit<ComponentProps<'div'>, 'children'> & {
  children: string
}

export const MessageResponse = memo(
  ({ className, children, ...props }: MessageResponseProps) => (
    <div
      className={cn(
        'prose prose-a:link-underline min-w-0 prose-a:font-normal text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
        className
      )}
      data-slot='message-response'
      {...props}
    >
      <Markdown text={children} />
    </div>
  ),
  (prev, next) =>
    prev.children === next.children && prev.className === next.className
)

MessageResponse.displayName = 'MessageResponse'

type MessageActionsProps = ComponentProps<'div'>

export const MessageActions = ({
  className,
  ...props
}: MessageActionsProps) => (
  <div className={cn('flex items-center gap-0.5', className)} {...props} />
)

type MessageActionProps = ComponentProps<typeof Button> & {
  label: string
}

export const MessageAction = ({
  className,
  label,
  ...props
}: MessageActionProps) => (
  <Tooltip>
    <TooltipTrigger
      render={
        <Button
          aria-label={label}
          className={cn(
            'pointer-coarse:size-8 text-muted-foreground [&_svg]:size-3.5',
            className
          )}
          size='icon-xs'
          type='button'
          variant='ghost'
          {...props}
        />
      }
    />
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
)
