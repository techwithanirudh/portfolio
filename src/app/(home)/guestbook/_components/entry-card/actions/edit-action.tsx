import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface EditActionButtonProps {
  disabled: boolean
  onClick: () => void
}

export const EditActionButton = ({
  disabled,
  onClick,
}: EditActionButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label='Edit entry'
          disabled={disabled}
          onClick={onClick}
          shape='square'
          size='icon'
          variant='ghost'
        >
          <Icons.pencil className='size-4' />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Edit entry</TooltipContent>
    </Tooltip>
  )
}
