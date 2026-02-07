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
  const banLabel = isBanned ? 'Unban user' : 'Ban user'
  const busyLabel = isBanned ? 'Unbanning...' : 'Banning...'
  const actionLabel = isBusy ? busyLabel : banLabel

  return (
    <Dialog onOpenChange={isBusy ? undefined : onOpenChange} open={isOpen}>
      <DialogContent
        onEscapeKeyDown={isBusy ? (e) => e.preventDefault() : undefined}
        onPointerDownOutside={isBusy ? (e) => e.preventDefault() : undefined}
      >
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
            disabled={isBusy}
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
            variant={isBanned ? 'outline' : 'destructive'}
          >
            {isBusy ? <Loader2 className='animate-spin' /> : null}
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
