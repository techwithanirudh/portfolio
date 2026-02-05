'use client'

import { formatDistanceToNow } from 'date-fns'
import { BadgeCheck } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { toast } from 'sonner'

import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { GuestbookEntryItem } from '@/lib/validators/guestbook'
import {
  banGuestbookUser,
  editGuestbookEntry,
  removeGuestbookEntry,
} from '../../actions/guestbook'
import { GuestbookReactions } from '../reactions'
import { EntryCardActions } from './actions'
import { BanUserModal } from './ban-user-modal'
import { DeleteEntryModal } from './delete-entry-modal'

interface GuestbookEntryCardProps {
  entry: GuestbookEntryItem
  currentUserId: string | null
  isAdmin: boolean
  isSignedIn: boolean
}

export const GuestbookEntryCard = ({
  entry,
  currentUserId,
  isAdmin,
  isSignedIn,
}: GuestbookEntryCardProps) => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [draftMessage, setDraftMessage] = useState(entry.message)
  const [isBanModalOpen, setIsBanModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const editAction = useAction(editGuestbookEntry, {
    onSuccess: () => {
      setIsEditing(false)
      router.refresh()
    },
  })
  const deleteAction = useAction(removeGuestbookEntry, {
    onSuccess: () => {
      setIsEditing(false)
      setIsDeleteModalOpen(false)
      router.refresh()
    },
  })
  const banAction = useAction(banGuestbookUser, {
    onSuccess: () => {
      setIsEditing(false)
      setIsBanModalOpen(false)
      router.refresh()
      toast.success(
        entry.banned ? `Unbanned ${entry.name}.` : `Banned ${entry.name}.`
      )
    },
  })

  const canEdit = !!currentUserId && (isAdmin || currentUserId === entry.userId)
  const canBan =
    isAdmin && entry.role !== 'admin' && currentUserId !== entry.userId
  const editedLabel = entry.editedAt ? ' • Edited' : ''
  const isBusy =
    editAction.status === 'executing' ||
    deleteAction.status === 'executing' ||
    banAction.status === 'executing'

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

  const banUser = () => {
    setIsEditing(false)
    banAction.execute({
      userId: entry.userId,
      action: entry.banned ? 'unban' : 'ban',
    })
  }

  return (
    <div className='relative grid gap-4 bg-card/50 px-6 py-6 transition-colors hover:bg-card/80'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div className='space-y-1'>
          <h3 className='flex items-center gap-1.5 font-medium text-sm'>
            {entry.name}
            {entry.role === 'admin' ? (
              <BadgeCheck
                aria-label='Verified admin'
                className='size-4 text-primary'
              />
            ) : null}
          </h3>
          <p className='text-muted-foreground text-xs'>
            {formatDistanceToNow(new Date(entry.createdAt), {
              addSuffix: true,
            })}
            {editedLabel}
          </p>
        </div>
        <EntryCardActions
          canBan={canBan}
          canEdit={canEdit}
          isBanned={entry.banned}
          isBusy={isBusy}
          isEditing={isEditing}
          onBanModalOpen={() => setIsBanModalOpen(true)}
          onDeleteModalOpen={() => setIsDeleteModalOpen(true)}
          onEdit={startEditing}
        />
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
                <Icons.spinner className='size-4 animate-spin' />
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
        <p className='text-muted-foreground text-sm'>{entry.message}</p>
      )}
      {isEditing ? null : (
        <GuestbookReactions
          canReact={isSignedIn}
          entryId={entry.id}
          reactions={entry.reactions}
        />
      )}
      {entry.signature && !isEditing ? (
        <Image
          alt={`Signature by ${entry.name}`}
          className='absolute right-6 bottom-6 rounded border border-border border-dashed dark:invert'
          height={48}
          src={entry.signature}
          unoptimized
          width={100}
        />
      ) : null}
      {deleteAction.result.serverError ? (
        <p className='text-destructive text-xs'>
          {deleteAction.result.serverError}
        </p>
      ) : null}
      {banAction.result.serverError ? (
        <p className='text-destructive text-xs'>
          {banAction.result.serverError}
        </p>
      ) : null}
      <BanUserModal
        isBanned={entry.banned}
        isBusy={isBusy}
        isOpen={isBanModalOpen}
        name={entry.name}
        onConfirm={banUser}
        onOpenChange={setIsBanModalOpen}
      />
      <DeleteEntryModal
        isBusy={isBusy}
        isOpen={isDeleteModalOpen}
        name={entry.name}
        onConfirm={deleteEntry}
        onOpenChange={setIsDeleteModalOpen}
      />
    </div>
  )
}
