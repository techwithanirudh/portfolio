'use client'

import Image from 'next/image'
import { useAssistantContext } from '@/components/features/assistant'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import simba from '@/public/images/simba.jpg'

export const AskSimbaButton = ({ className }: { className?: string }) => {
  const { setOpen } = useAssistantContext()

  return (
    <Button
      className={cn(
        'pr-3 pl-1.5 dark:bg-background dark:ring-white/10 dark:hover:bg-accent',
        className
      )}
      onClick={() => setOpen(true)}
      size='lg'
      variant='outline'
    >
      <Image
        alt=''
        className='size-7 rounded-[max(2px,calc(var(--radius-md)-6px))] ring-1 ring-border'
        placeholder='blur'
        sizes='28px'
        src={simba}
      />
      Ask Simba
    </Button>
  )
}
