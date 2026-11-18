'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from '@/lib/toast'
import { GuestbookEntrySchema } from '@/lib/validators/guestbook'
import type { GuestbookEntryItem } from '@/types/guestbook'
import { EntryByline } from './byline'
import { EntryCardActions } from './card-actions'
import { ConfirmDialog } from './confirm-dialog'
import { EntryEditForm } from './edit-form'
import { EntryFooter } from './footer'
import { useEntryActions } from './use-entry-actions'

interface GuestbookEntryCardProps {
  currentUserId: string | null
  entry: GuestbookEntryItem
  isAdmin: boolean
}

export const GuestbookEntryCard = ({
  entry,
  currentUserId,
  isAdmin,
}: GuestbookEntryCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef(false)
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
    restoreFocus.current = true
    setIsEditing(false)
    setDraftMessage(entry.message)
  }

  useEffect(() => {
    if (isEditing || !restoreFocus.current) {
      return
    }
    restoreFocus.current = false
    cardRef.current
      ?.querySelector<HTMLButtonElement>('button[aria-label="Edit entry"]')
      ?.focus()
  }, [isEditing])

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
      toast.error(
        validation.error.issues[0]?.message ??
          'Check your message and try again.'
      )
      return
    }

    if (isBusy || disabled) {
      toast.error('No changes to save')
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
      className='relative grid grid-cols-[minmax(0,1fr)] gap-4 bg-card/50 p-6 transition-colors hover:bg-card/80'
      ref={cardRef}
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
          isSaving={edit.isExecuting}
          onCancel={cancelEditing}
          onChange={setDraftMessage}
          onSave={submitEdit}
        />
      ) : (
        <p className='wrap-anywhere text-muted-foreground text-sm'>
          {entry.message}
        </p>
      )}
      {isEditing ? null : (
        <EntryFooter canReact={!!currentUserId} entry={entry} />
      )}
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
        description={`This permanently deletes ${entry.name}'s entry. You can't undo this.`}
        isBusy={isBusy}
        isOpen={isDeleteModalOpen}
        onConfirm={deleteEntry}
        onOpenChange={setIsDeleteModalOpen}
        title='Delete entry?'
      />
    </div>
  )
}
