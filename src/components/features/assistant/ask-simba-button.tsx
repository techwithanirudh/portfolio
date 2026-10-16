'use client'

import { useAssistantContext } from '@/components/features/assistant'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const AskSimbaButton = ({ className }: { className?: string }) => {
  const { setOpen } = useAssistantContext()

  return (
    <Button
      className={cn(
        'group/simba dark:bg-background dark:ring-white/10 dark:hover:bg-accent',
        className
      )}
      onClick={() => setOpen(true)}
      size='lg'
      variant='outline'
    >
      <Icons.pawPrint className='size-4 text-primary transition-transform duration-200 ease-out group-hover/simba:-rotate-45 motion-reduce:transition-none' />
      Ask Simba
    </Button>
  )
}
