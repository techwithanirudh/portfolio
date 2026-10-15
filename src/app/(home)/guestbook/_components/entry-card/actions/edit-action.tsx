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
}: EditActionButtonProps) => (
  <Tooltip>
    <TooltipTrigger
      render={
        <Button
          aria-label='Edit entry'
          disabled={disabled}
          onClick={onClick}
          size='icon'
          variant='ghost'
        />
      }
    >
      <Icons.pencil className='size-4' />
    </TooltipTrigger>
    <TooltipContent>Edit entry</TooltipContent>
  </Tooltip>
)
