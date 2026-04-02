import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface DeleteActionButtonProps {
  disabled: boolean
  onClick: () => void
}

export const DeleteActionButton = ({
  disabled,
  onClick,
}: DeleteActionButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label='Delete entry'
          className='text-destructive'
          disabled={disabled}
          onClick={onClick}
          shape='square'
          size='icon'
          variant='ghost'
        >
          <Icons.trash className='size-4' />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Delete entry</TooltipContent>
    </Tooltip>
  )
}
