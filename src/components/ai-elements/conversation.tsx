'use client'

import type { ComponentProps, ReactNode } from 'react'
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type ConversationProps = ComponentProps<typeof StickToBottom>

// A live log that sticks to the newest message while it streams, and lets go
// as soon as the reader scrolls up
export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn('relative flex-1 overflow-y-hidden', className)}
    initial='instant'
    resize='smooth'
    role='log'
    {...props}
  />
)

export type ConversationContentProps = ComponentProps<
  typeof StickToBottom.Content
>

export const ConversationContent = ({
  className,
  scrollClassName,
  ...props
}: ConversationContentProps) => (
  <StickToBottom.Content
    className={cn('flex min-h-full flex-col', className)}
    scrollClassName={cn('overscroll-contain', scrollClassName)}
    {...props}
  />
)

export type ConversationEmptyStateProps = ComponentProps<'div'> & {
  title?: string
  description?: ReactNode
  icon?: ReactNode
}

export const ConversationEmptyState = ({
  className,
  title,
  description,
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <div
    className={cn(
      'flex flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground text-sm',
      className
    )}
    {...props}
  >
    {children ?? (
      <>
        {icon}
        {title ? (
          <h3 className='font-medium text-foreground text-sm'>{title}</h3>
        ) : null}
        {description ? <p>{description}</p> : null}
      </>
    )}
  </div>
)

export type ConversationScrollButtonProps = ComponentProps<typeof Button>

export const ConversationScrollButton = ({
  className,
  children,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()

  if (isAtBottom) {
    return null
  }

  return (
    <Button
      aria-label='Scroll to latest message'
      className={cn(
        'absolute bottom-3 left-1/2 -translate-x-1/2 animate-fd-fade-in border-dashed bg-popover/90 backdrop-blur-xs',
        className
      )}
      onClick={() => scrollToBottom()}
      shape='square'
      size='icon-sm'
      type='button'
      variant='dashed'
      {...props}
    >
      {children ?? <Icons.arrowDown className='size-4' />}
    </Button>
  )
}
