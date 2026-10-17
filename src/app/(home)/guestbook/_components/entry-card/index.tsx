'use client'

import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { getActionErrorMessage } from '@/lib/safe-action/error-message'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import {
  type GuestbookEntryItem,
  GuestbookEntrySchema,
} from '@/lib/validators/guestbook'
import {
  banGuestbookUser,
  editGuestbookEntry,
  removeGuestbookEntry,
} from '../../actions/guestbook'
import { GuestbookReactions } from '../reactions'
import { EntryCardActions } from './actions'
import { ConfirmDialog } from './confirm-dialog'

interface GuestbookEntryCardProps {
  currentUserId: string | null
  entry: GuestbookEntryItem
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
    onError: ({ error }) => {
      toast.error(
        getActionErrorMessage(error, "Your message wasn't updated. Try again.")
      )
    },
    onSuccess: () => {
      setIsEditing(false)
      router.refresh()
      toast.success('Guestbook entry updated.')
    },
  })
  const deleteAction = useAction(removeGuestbookEntry, {
    onError: ({ error }) => {
      toast.error(
        getActionErrorMessage(error, "The message wasn't deleted. Try again.")
      )
    },
    onSuccess: () => {
      setIsEditing(false)
      setIsDeleteModalOpen(false)
      router.refresh()
      toast.success('Guestbook entry deleted.')
    },
  })
  const banAction = useAction(banGuestbookUser, {
    onError: ({ error }) => {
      toast.error(
        getActionErrorMessage(error, "The ban status didn't change. Try again.")
      )
    },
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

    const validation = GuestbookEntrySchema.safeParse({
      message: trimmedMessage,
    })

    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message ?? 'Invalid message.')
      return
    }

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
      action: entry.banned ? 'unban' : 'ban',
      userId: entry.userId,
    })
  }

  return (
    <div
      className={cn(
        'relative grid grid-cols-[minmax(0,1fr)] gap-4 bg-card/50 p-6 transition-colors hover:bg-card/80'
      )}
    >
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div className='min-w-0 space-y-1'>
          <h3 className='wrap-anywhere font-medium text-sm'>
            {entry.name}
            {entry.role === 'admin' ? (
              <Icons.verifiedAdmin
                aria-label='Verified admin'
                className='icon-pop ml-1.5 inline size-4 align-[-3px] text-primary'
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
            aria-label='Edit message'
            className='wrap-anywhere min-h-[8rem] resize-y bg-background'
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
        </div>
      ) : (
        <p className='wrap-anywhere text-muted-foreground text-sm'>
          {entry.message}
        </p>
      )}
      <div className='flex w-full flex-wrap items-end justify-between gap-4 empty:hidden'>
        {isEditing ? null : (
          <GuestbookReactions
            canReact={isSignedIn}
            entryId={entry.id}
            reactions={entry.reactions}
          />
        )}
        {entry.signature && !isEditing ? (
          <div className='h-[63px] w-[140px] rounded border border-border border-dashed bg-card'>
            <Image
              alt={`Signature by ${entry.name}`}
              className='h-[63px] w-[140px] object-contain dark:invert'
              height={63}
              src={entry.signature}
              unoptimized
              width={140}
            />
          </div>
        ) : null}
      </div>
      <ConfirmDialog
        busyLabel={entry.banned ? 'Unbanning…' : 'Banning…'}
        confirmLabel={entry.banned ? 'Unban user' : 'Ban user'}
        description={
          entry.banned
            ? `This will allow ${entry.name} to sign in again.`
            : `This will sign ${entry.name} out and block future sign-ins.`
        }
        isBusy={isBusy}
        isOpen={isBanModalOpen}
        onConfirm={banUser}
        onOpenChange={setIsBanModalOpen}
        title={entry.banned ? 'Unban user?' : 'Ban user?'}
        variant={entry.banned ? 'outline' : 'destructive'}
      />
      <ConfirmDialog
        busyLabel='Deleting…'
        confirmLabel='Delete entry'
        description={`This will remove ${entry.name}'s guestbook entry permanently.`}
        isBusy={isBusy}
        isOpen={isDeleteModalOpen}
        onConfirm={deleteEntry}
        onOpenChange={setIsDeleteModalOpen}
        title='Delete entry?'
      />
    </div>
  )
}
