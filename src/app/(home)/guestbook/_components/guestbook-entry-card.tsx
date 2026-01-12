'use client'

import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { useEffect, useState } from 'react'
import { Icons } from '@/components/icons/icons'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { editGuestbookEntry } from '../actions/guestbook'
import type { GuestbookEntryItem } from './guestbook-types'
import { GuestbookReactions } from './guestbook-reactions'

interface GuestbookEntryCardProps {
  entry: GuestbookEntryItem
  currentUserId: string | null
  isSignedIn: boolean
}

export const GuestbookEntryCard = ({
  entry,
  currentUserId,
  isSignedIn,
}: GuestbookEntryCardProps) => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [draftMessage, setDraftMessage] = useState(entry.message)

  const { execute, status, result } = useAction(editGuestbookEntry)

  useEffect(() => {
    if (status === 'hasSucceeded') {
      setIsEditing(false)
      router.refresh()
    }
  }, [router, status])

  const canEdit = currentUserId === entry.userId
  const editedLabel = entry.editedAt ? ' • Edited' : ''

  const startEditing = () => {
    setIsEditing(true)
    setDraftMessage(entry.message)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setDraftMessage(entry.message)
  }

  const submitEdit = () => {
    execute({ entryId: entry.id, message: draftMessage })
  }

  return (
    <Card className='border-dashed shadow-none'>
      <CardHeader className='space-y-1 pb-4'>
        <CardTitle className='text-base'>{entry.name}</CardTitle>
        <CardDescription>
          {formatDistanceToNow(new Date(entry.createdAt), {
            addSuffix: true,
          })}
          {editedLabel}
        </CardDescription>
        {canEdit ? (
          <CardAction>
            <Button
              className='text-xs'
              disabled={status === 'executing' || isEditing}
              onClick={startEditing}
              size='sm'
              variant='ghost'
            >
              Edit
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className='space-y-4'>
        {isEditing ? (
          <div className='space-y-3'>
            <Textarea
              className='min-h-[8rem] resize-y bg-background'
              disabled={status === 'executing'}
              onChange={(event) => setDraftMessage(event.target.value)}
              value={draftMessage}
            />
            <div className='flex flex-wrap gap-2'>
              <Button
                className='px-4'
                disabled={status === 'executing'}
                onClick={submitEdit}
                size='sm'
                type='button'
              >
                {status === 'executing' ? (
                  <Icons.spinner className='mr-2 size-4 animate-spin' />
                ) : null}
                Save
              </Button>
              <Button
                disabled={status === 'executing'}
                onClick={cancelEditing}
                size='sm'
                type='button'
                variant='ghost'
              >
                Cancel
              </Button>
            </div>
            {result.serverError ? (
              <p className='text-destructive text-xs'>{result.serverError}</p>
            ) : null}
          </div>
        ) : (
          <p className='whitespace-pre-wrap text-sm text-muted-foreground'>
            {entry.message}
          </p>
        )}
        {isEditing ? null : (
          <GuestbookReactions
            canReact={isSignedIn}
            entryId={entry.id}
            reactions={entry.reactions}
          />
        )}
      </CardContent>
    </Card>
  )
}
