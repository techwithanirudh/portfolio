'use client'

import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { toast } from 'sonner'

import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { GuestbookEntryItem } from '@/lib/validators/guestbook'
import { editGuestbookEntry, removeGuestbookEntry } from '../actions/guestbook'
import { GuestbookReactions } from './reactions'

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

  const editAction = useAction(editGuestbookEntry, {
    onSuccess: () => {
      setIsEditing(false)
      router.refresh()
    },
  })
  const deleteAction = useAction(removeGuestbookEntry, {
    onSuccess: () => {
      setIsEditing(false)
      router.refresh()
    },
  })

  const canEdit = !!currentUserId && currentUserId === entry.userId
  const editedLabel = entry.editedAt ? ' • Edited' : ''
  const isBusy =
    editAction.status === 'executing' || deleteAction.status === 'executing'

  const startEditing = () => {
    setIsEditing(true)
    setDraftMessage(entry.message)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setDraftMessage(entry.message)
  }

  const submitEdit = () => {
    const { message, id } = entry

    const trimmedMessage = draftMessage.trim()
    const originalMessage = message.trim()

    const disabled =
      trimmedMessage.length === 0 || trimmedMessage === originalMessage

    if (isBusy || disabled) {
      toast.error('No changes to save or message is empty.')
      setIsEditing(false)
      return
    }

    editAction.execute({ entryId: id, message: trimmedMessage })
  }

  const deleteEntry = () => {
    setIsEditing(false)
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
              disabled={isBusy || isEditing}
              onClick={startEditing}
              size='icon'
              variant='ghost'
            >
              <Icons.pencil className='size-4' />
            </Button>
            <Button
              aria-label='Delete entry'
              className='rounded-none text-destructive'
              disabled={isBusy || isEditing}
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
            disabled={isBusy}
            onChange={(event) => setDraftMessage(event.target.value)}
            value={draftMessage}
          />
          <div className='flex flex-wrap gap-2'>
            <Button
              className='px-4'
              disabled={isBusy}
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
              disabled={isBusy}
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
        <>
          <p className='text-muted-foreground text-sm'>{entry.message}</p>
          {entry.signature ? (
            <Image
              alt={`Signature by ${entry.name}`}
              className='mt-2 rounded border border-border p-2 dark:invert'
              height={96}
              src={entry.signature}
              unoptimized
              width={200}
            />
          ) : null}
        </>
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
