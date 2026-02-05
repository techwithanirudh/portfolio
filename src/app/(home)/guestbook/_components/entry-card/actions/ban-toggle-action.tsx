import { Check, CircleOff } from 'lucide-react'
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
          className='rounded-none text-destructive'
          disabled={disabled}
          onClick={onClick}
          size='icon'
          variant='ghost'
        >
          {isBanned ? (
            <Check className='size-4' />
          ) : (
            <CircleOff className='size-4' />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{isBanned ? 'Unban user' : 'Ban user'}</TooltipContent>
    </Tooltip>
  )
}
