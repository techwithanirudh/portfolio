import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface BanUserModalProps {
  isOpen: boolean
  isBanned: boolean
  isBusy: boolean
  name: string
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
}

export const BanUserModal = ({
  isOpen,
  isBanned,
  isBusy,
  name,
  onConfirm,
  onOpenChange,
}: BanUserModalProps) => {
  let actionLabel = 'Ban user'

  if (isBanned) {
    actionLabel = 'Unban user'
  }

  if (isBusy) {
    actionLabel = isBanned ? 'Unbanning...' : 'Banning...'
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isBanned ? 'Unban user?' : 'Ban user?'}</DialogTitle>
          <DialogDescription>
            {isBanned
              ? `This will allow ${name} to sign in again.`
              : `This will sign ${name} out and block future sign-ins.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            type='button'
            variant='ghost'
          >
            Cancel
          </Button>
          <Button
            className='px-4'
            disabled={isBusy}
            onClick={onConfirm}
            type='button'
            variant='destructive'
          >
            {isBusy ? <Loader2 className='animate-spin' /> : null}
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
