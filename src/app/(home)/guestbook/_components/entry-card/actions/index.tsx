import { BanToggleActionButton } from './ban-toggle-action'
import { DeleteActionButton } from './delete-action'
import { EditActionButton } from './edit-action'

interface EntryCardActionsProps {
  canEdit: boolean
  canBan: boolean
  isBanned: boolean
  isBusy: boolean
  isEditing: boolean
  onEdit: () => void
  onDeleteModalOpen: () => void
  onBanModalOpen: () => void
}

export const EntryCardActions = ({
  canEdit,
  canBan,
  isBanned,
  isBusy,
  isEditing,
  onEdit,
  onDeleteModalOpen,
  onBanModalOpen,
}: EntryCardActionsProps) => {
  if (!(canEdit || canBan)) {
    return null
  }

  return (
    <div className='flex items-center'>
      {canEdit ? (
        <>
          <EditActionButton disabled={isBusy || isEditing} onClick={onEdit} />
          <DeleteActionButton
            disabled={isBusy || isEditing}
            onClick={onDeleteModalOpen}
          />
        </>
      ) : null}
      {canBan ? (
        <BanToggleActionButton
          disabled={isBusy}
          isBanned={isBanned}
          onClick={onBanModalOpen}
        />
      ) : null}
    </div>
  )
}
