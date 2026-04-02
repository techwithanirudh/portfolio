import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={isBanned ? 'Unban user' : 'Ban user'}
          className='text-destructive'
          disabled={disabled}
          onClick={onClick}
          shape='square'
          size='icon'
          variant='ghost'
        >
          {isBanned ? (
            <Icons.check className='size-4' />
          ) : (
            <Icons.ban className='size-4' />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{isBanned ? 'Unban user' : 'Ban user'}</TooltipContent>
    </Tooltip>
  )
}
