'use client'

import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { useEffect, useState } from 'react'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { editGuestbookEntry, removeGuestbookEntry } from '../actions/guestbook'
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

  const editAction = useAction(editGuestbookEntry)
  const deleteAction = useAction(removeGuestbookEntry)

  useEffect(() => {
    if (editAction.status === 'hasSucceeded') {
      setIsEditing(false)
      router.refresh()
    }
  }, [editAction.status, router])

  useEffect(() => {
    if (deleteAction.status === 'hasSucceeded') {
      router.refresh()
    }
  }, [deleteAction.status, router])

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
    editAction.execute({ entryId: entry.id, message: draftMessage })
  }

  const deleteEntry = () => {
    deleteAction.execute({ entryId: entry.id })
  }

  return (
    <div className='grid gap-4 bg-card/50 px-6 py-6 transition-colors hover:bg-card/80'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div className='space-y-1'>
          <h3 className='font-medium text-sm'>{entry.name}</h3>
          <p className='text-muted-foreground text-xs'>
            {formatDistanceToNow(new Date(entry.createdAt), {
              addSuffix: true,
            })}
            {editedLabel}
          </p>
        </div>
        {canEdit ? (
          <div className='flex items-center'>
            <Button
              aria-label='Edit entry'
              className='rounded-none'
              disabled={editAction.status === 'executing' || isEditing}
              onClick={startEditing}
              size='icon'
              variant='ghost'
            >
              <Icons.pencil className='size-4' />
            </Button>
            <Button
              aria-label='Delete entry'
              className='rounded-none text-destructive'
              disabled={
                deleteAction.status === 'executing' ||
                editAction.status === 'executing'
              }
              onClick={deleteEntry}
              size='icon'
              variant='ghost'
            >
              <Icons.trash className='size-4' />
            </Button>
          </div>
        ) : null}
      </div>
      {isEditing ? (
        <div className='space-y-3'>
          <Textarea
            className='min-h-[8rem] resize-y bg-background'
            disabled={editAction.status === 'executing'}
            onChange={(event) => setDraftMessage(event.target.value)}
            value={draftMessage}
          />
          <div className='flex flex-wrap gap-2'>
            <Button
              className='px-4'
              disabled={editAction.status === 'executing'}
              onClick={submitEdit}
              size='sm'
              type='button'
            >
              {editAction.status === 'executing' ? (
                <Icons.spinner className='mr-2 size-4 animate-spin' />
              ) : null}
              Save
            </Button>
            <Button
              disabled={editAction.status === 'executing'}
              onClick={cancelEditing}
              size='sm'
              type='button'
              variant='ghost'
            >
              Cancel
            </Button>
          </div>
          {editAction.result.serverError ? (
            <p className='text-destructive text-xs'>
              {editAction.result.serverError}
            </p>
          ) : null}
        </div>
      ) : (
        <p className='text-sm text-muted-foreground'>{entry.message}</p>
      )}
      {isEditing ? null : (
        <GuestbookReactions
          canReact={isSignedIn}
          entryId={entry.id}
          reactions={entry.reactions}
        />
      )}
      {deleteAction.result.serverError ? (
        <p className='text-destructive text-xs'>
          {deleteAction.result.serverError}
        </p>
      ) : null}
    </div>
  )
}
