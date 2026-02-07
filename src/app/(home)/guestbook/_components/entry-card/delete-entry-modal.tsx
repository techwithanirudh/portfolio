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
  const actionLabel = isBusy ? 'Deleting...' : 'Delete entry'

  return (
    <Dialog onOpenChange={isBusy ? undefined : onOpenChange} open={isOpen}>
      <DialogContent
        onEscapeKeyDown={isBusy ? (e) => e.preventDefault() : undefined}
        onPointerDownOutside={isBusy ? (e) => e.preventDefault() : undefined}
      >
        <DialogHeader>
          <DialogTitle>Delete entry?</DialogTitle>
          <DialogDescription>
            This will remove {name}'s guestbook entry permanently.
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
            disabled={isBusy}
            onClick={onConfirm}
            type='button'
            variant='destructive'
          >
            {isBusy ? <Loader2 className='size-4 animate-spin' /> : null}
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
