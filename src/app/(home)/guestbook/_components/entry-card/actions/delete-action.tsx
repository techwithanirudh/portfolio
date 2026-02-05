import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'

interface DeleteActionButtonProps {
  disabled: boolean
  onClick: () => void
}

export const DeleteActionButton = ({
  disabled,
  onClick,
}: DeleteActionButtonProps) => {
  return (
    <Button
      aria-label='Delete entry'
      className='rounded-none text-destructive'
      disabled={disabled}
      onClick={onClick}
      size='icon'
      variant='ghost'
    >
      <Icons.trash className='size-4' />
    </Button>
  )
}
