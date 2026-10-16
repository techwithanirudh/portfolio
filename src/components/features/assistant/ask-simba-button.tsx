'use client'

import Image from 'next/image'
import { useAssistantContext } from '@/components/features/assistant'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const AskSimbaButton = ({ className }: { className?: string }) => {
  const { setOpen } = useAssistantContext()

  return (
    <Button
      className={cn(
        'pr-4 pl-1.5 dark:bg-background dark:ring-white/10 dark:hover:bg-accent',
        className
      )}
      onClick={() => setOpen(true)}
      size='lg'
      variant='outline'
    >
      <Image
        alt=''
        className='size-7 rounded-full ring-1 ring-border'
        height={28}
        src='/images/simba.jpg'
        width={28}
      />
      Ask Simba
    </Button>
  )
}
