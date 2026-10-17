import type { ReactNode } from 'react'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ConfirmDialogProps {
  busyLabel: string
  confirmLabel: string
  description: ReactNode
  isBusy: boolean
  isOpen: boolean
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
  title: string
  variant?: 'destructive' | 'outline'
}

export const ConfirmDialog = ({
  busyLabel,
  confirmLabel,
  description,
  isBusy,
  isOpen,
  onConfirm,
  onOpenChange,
  title,
  variant = 'destructive',
}: ConfirmDialogProps) => (
  <Dialog onOpenChange={isBusy ? undefined : onOpenChange} open={isOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
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
          variant={variant}
        >
          {isBusy ? <Icons.spinner className='size-4 animate-spin' /> : null}
          {isBusy ? busyLabel : confirmLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
