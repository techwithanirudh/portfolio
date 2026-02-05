import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'

interface BanToggleActionButtonProps {
  disabled: boolean
  isBanned: boolean
  onClick: () => void
}

export const BanToggleActionButton = ({
  disabled,
  isBanned,
  onClick,
}: BanToggleActionButtonProps) => {
  return (
    <Button
      aria-label={isBanned ? 'Unban user' : 'Ban user'}
      className='rounded-none text-destructive'
      disabled={disabled}
      onClick={onClick}
      size='icon'
      variant='ghost'
    >
      {isBanned ? (
        <Icons.check className='size-4' />
      ) : (
        <Icons.warning className='size-4' />
      )}
    </Button>
  )
}
