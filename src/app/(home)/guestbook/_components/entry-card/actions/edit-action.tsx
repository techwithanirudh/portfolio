import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'

interface EditActionButtonProps {
  disabled: boolean
  onClick: () => void
}

export const EditActionButton = ({
  disabled,
  onClick,
}: EditActionButtonProps) => {
  return (
    <Button
      aria-label='Edit entry'
      className='rounded-none'
      disabled={disabled}
      onClick={onClick}
      size='icon'
      variant='ghost'
    >
      <Icons.pencil className='size-4' />
    </Button>
  )
}
