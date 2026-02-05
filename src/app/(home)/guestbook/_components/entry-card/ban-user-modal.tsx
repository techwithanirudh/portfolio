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
            {isBanned ? 'Unban user' : 'Ban user'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
