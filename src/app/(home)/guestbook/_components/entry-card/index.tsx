'use client'

import { useState } from 'react'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import {
  type GuestbookEntryItem,
  GuestbookEntrySchema,
} from '@/lib/validators/guestbook'
import { EntryCardActions } from './actions'
import { EntryByline } from './byline'
import { ConfirmDialog } from './confirm-dialog'
import { EntryEditForm } from './edit-form'
import { EntryFooter } from './footer'
import { useEntryActions } from './use-entry-actions'

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
  const [isEditing, setIsEditing] = useState(false)
  const [draftMessage, setDraftMessage] = useState(entry.message)
  const [isBanModalOpen, setIsBanModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { ban, edit, isBusy, remove } = useEntryActions(entry, {
    closeBanModal: () => setIsBanModalOpen(false),
    closeDeleteModal: () => setIsDeleteModalOpen(false),
    closeEditor: () => setIsEditing(false),
  })

  const canEdit = !!currentUserId && (isAdmin || currentUserId === entry.userId)
  const canBan =
    isAdmin && entry.role !== 'admin' && currentUserId !== entry.userId

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

    edit.execute({ entryId: id, message: trimmedMessage })
  }

  const deleteEntry = () => {
    setIsEditing(false)
    remove.execute({ entryId: entry.id })
  }

  const banUser = () => {
    setIsEditing(false)
    ban.execute({
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
        <EntryByline entry={entry} />
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
        <EntryEditForm
          draft={draftMessage}
          isBusy={isBusy}
          isSaving={edit.status === 'executing'}
          onCancel={cancelEditing}
          onChange={setDraftMessage}
          onSave={submitEdit}
        />
      ) : (
        <p className='wrap-anywhere text-muted-foreground text-sm'>
          {entry.message}
        </p>
      )}
      {isEditing ? null : <EntryFooter canReact={isSignedIn} entry={entry} />}
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
