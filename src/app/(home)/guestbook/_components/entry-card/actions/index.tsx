import type { ReactNode } from 'react'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface EntryActionButtonProps {
  disabled: boolean
  icon: ReactNode
  label: string
  onClick: () => void
  tone?: 'default' | 'destructive'
}

const EntryActionButton = ({
  disabled,
  icon,
  label,
  onClick,
  tone = 'default',
}: EntryActionButtonProps) => (
  <Tooltip>
    <TooltipTrigger
      render={
        <Button
          aria-label={label}
          className={tone === 'destructive' ? 'text-destructive' : undefined}
          disabled={disabled}
          onClick={onClick}
          shape='square'
          size='icon'
          variant='ghost'
        />
      }
    >
      {icon}
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
)

interface EntryCardActionsProps {
  canBan: boolean
  canEdit: boolean
  isBanned: boolean
  isBusy: boolean
  isEditing: boolean
  onBanModalOpen: () => void
  onDeleteModalOpen: () => void
  onEdit: () => void
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
          <EntryActionButton
            disabled={isBusy || isEditing}
            icon={<Icons.pencil className='size-4' />}
            label='Edit entry'
            onClick={onEdit}
          />
          <EntryActionButton
            disabled={isBusy || isEditing}
            icon={<Icons.trash className='size-4' />}
            label='Delete entry'
            onClick={onDeleteModalOpen}
            tone='destructive'
          />
        </>
      ) : null}
      {canBan ? (
        <EntryActionButton
          disabled={isBusy}
          icon={
            isBanned ? (
              <Icons.check className='size-4' />
            ) : (
              <Icons.ban className='size-4' />
            )
          }
          label={isBanned ? 'Unban user' : 'Ban user'}
          onClick={onBanModalOpen}
          tone='destructive'
        />
      ) : null}
    </div>
  )
}
