'use client'

import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { useEffect, useState } from 'react'
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from '@/components/ui/emoji-picker'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons/icons'
import { cn } from '@/lib/utils'
import { toggleGuestbookReaction } from '../actions/guestbook'
import type { GuestbookReactionItem } from './guestbook-types'

interface GuestbookReactionsProps {
  entryId: number
  reactions: GuestbookReactionItem[]
  canReact: boolean
}

export const GuestbookReactions = ({
  entryId,
  reactions,
  canReact,
}: GuestbookReactionsProps) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [optimisticReactions, setOptimisticReactions] = useState(reactions)

  const { execute, status, result } = useAction(toggleGuestbookReaction)

  useEffect(() => {
    setOptimisticReactions(reactions)
  }, [reactions])

  useEffect(() => {
    if (status === 'hasSucceeded') {
      router.refresh()
    }
  }, [router, status])

  useEffect(() => {
    if (result.serverError) {
      setOptimisticReactions(reactions)
    }
  }, [reactions, result.serverError])

  const updateOptimisticReaction = (emoji: string) => {
    setOptimisticReactions((previous) => {
      const existing = previous.find((item) => item.emoji === emoji)

      if (!existing) {
        return [
          ...previous,
          {
            emoji,
            count: 1,
            reacted: true,
          },
        ]
      }

      const nextReacted = !existing.reacted
      const nextCount = existing.reacted
        ? Math.max(existing.count - 1, 0)
        : existing.count + 1

      const updated = previous.map((item) =>
        item.emoji === emoji
          ? {
              ...item,
              count: nextCount,
              reacted: nextReacted,
            }
          : item
      )

      if (nextCount === 0) {
        return updated.filter((item) => item.emoji !== emoji)
      }

      return updated
    })
  }

  const handleReaction = (emoji: string) => {
    updateOptimisticReaction(emoji)
    execute({ entryId, emoji })
    setIsOpen(false)
  }

  return (
    <div className='space-y-2'>
      <div className='flex flex-wrap gap-2'>
        {optimisticReactions.map((reaction) => (
          <Button
            className={cn(
              'gap-2 rounded-full border border-dashed border-border bg-transparent px-3 text-xs',
              reaction.reacted && 'border-primary text-primary'
            )}
            disabled={!canReact || status === 'executing'}
            key={`${entryId}-${reaction.emoji}`}
            onClick={() => handleReaction(reaction.emoji)}
            size='sm'
            type='button'
            variant='ghost'
          >
            <span>{reaction.emoji}</span>
            <span className='tabular-nums'>{reaction.count}</span>
          </Button>
        ))}
        <Popover onOpenChange={setIsOpen} open={isOpen}>
          <PopoverTrigger asChild>
            <Button
              className='gap-2 rounded-full border border-dashed border-border bg-transparent px-3 text-xs'
              disabled={!canReact}
              size='sm'
              type='button'
              variant='ghost'
            >
              <Icons.add className='size-3' />
              Add
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-fit p-0'>
            <EmojiPicker
              className='h-[342px]'
              onEmojiSelect={({ emoji }) => handleReaction(emoji)}
            >
              <EmojiPickerSearch />
              <EmojiPickerContent />
              <EmojiPickerFooter />
            </EmojiPicker>
          </PopoverContent>
        </Popover>
      </div>
      {canReact ? null : (
        <p className='text-muted-foreground text-xs'>Sign in to react.</p>
      )}
    </div>
  )
}
