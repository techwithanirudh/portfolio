'use client'

import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { PawPrint, PlusIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChatContextValue } from './chat-context'

export function ChatHeader() {
  const { setOpen, chat } = useChatContextValue()

  return (
    <div className='sticky top-0 flex h-10 items-start'>
      <div className='flex min-h-full flex-1 items-center justify-between rounded-none bg-fd-card px-3 py-2 text-fd-card-foreground'>
        <div className='flex items-center gap-2'>
          <PawPrint className='size-4 text-fd-primary transition-transform duration-200 hover:-rotate-45' />
          <p className='font-medium text-sm'>Ask Simba</p>
        </div>
      </div>

      <div className='flex min-h-full'>
        <button
          className={cn(
            buttonVariants({
              color: 'secondary',
              size: 'icon-sm',
              className:
                'group/button w-10 flex-1 rounded-none border-none [&_svg]:size-4',
            })
          )}
          onClick={() => chat.setMessages([])}
          type='button'
        >
          <PlusIcon className='transition-transform group-hover/button:rotate-90' />
        </button>
        <button
          aria-label='Close'
          className={cn(
            buttonVariants({
              size: 'icon-sm',
              color: 'primary',
              className:
                'group/button w-10 flex-1 rounded-none border-none [&_svg]:size-4',
            })
          )}
          onClick={() => setOpen(false)}
          tabIndex={-1}
          type='button'
        >
          <X className='transition-transform group-hover/button:rotate-90' />
        </button>
      </div>
    </div>
  )
}
