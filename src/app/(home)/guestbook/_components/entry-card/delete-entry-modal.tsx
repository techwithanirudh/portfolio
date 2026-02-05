import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DeleteEntryModalProps {
  isBusy: boolean
  isOpen: boolean
  name: string
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
}

export const DeleteEntryModal = ({
  isBusy,
  isOpen,
  name,
  onConfirm,
  onOpenChange,
}: DeleteEntryModalProps) => {
  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete entry?</DialogTitle>
          <DialogDescription>
            This will remove {name}'s guestbook entry permanently.
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
            disabled={isBusy}
            onClick={onConfirm}
            type='button'
            variant='destructive'
          >
            Delete entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
