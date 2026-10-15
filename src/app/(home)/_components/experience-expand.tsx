'use client'

import { useState } from 'react'
import { Icons } from '@/components/icons/icons'
import { buttonVariants } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

interface ExperienceExpandProps {
  /** The roles past the preview, rendered on the server */
  children: React.ReactNode
  total: number
}

// The rest of the roles open in place instead of sending you to /about,
// after chanhdai.com's experience list (MIT, (c) Chanh Dai)
export function ExperienceExpand({ children, total }: ExperienceExpandProps) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible onOpenChange={setOpen} open={open}>
      <CollapsibleContent
        className='h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-300 ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none'
        hiddenUntilFound
      >
        {children}
      </CollapsibleContent>
      <CollapsibleTrigger
        className={cn(
          buttonVariants({ shape: 'square', variant: 'default' }),
          'group h-auto w-full py-5 ring-0 active:scale-100 active:opacity-90'
        )}
      >
        {open ? 'Show less' : `Show all experience (${total})`}
        <Icons.chevronDown className='size-4 transition-transform duration-300 group-data-panel-open:rotate-180' />
      </CollapsibleTrigger>
    </Collapsible>
  )
}
