'use client'

import { useSound } from '@web-kits/audio/react'
import { IconSwap, IconSwapItem } from '@/components/icon-swap'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { toggleOn } from '@/lib/audio/minimal'
import { cn } from '@/lib/utils'
import { useChatContext } from './chat-context'
import { useAssistantContext } from './context'

const headerButtonClassName = 'shadow-none ring-0 focus-visible:ring-inset'

export function AssistantHeader() {
  const { expanded, setContext, setExpanded, setOpen } = useAssistantContext()
  const chat = useChatContext()
  const playNewChat = useSound(toggleOn)

  return (
    <div className='sticky top-0 flex items-stretch'>
      <div className='flex min-w-0 flex-1 items-center gap-2 bg-card px-3 text-card-foreground'>
        <span className='font-medium text-sm'>Ask Simba</span>
      </div>

      <div className='flex'>
        <Button
          aria-label='New chat'
          className={headerButtonClassName}
          onClick={() => {
            playNewChat()
            chat.stop()
            chat.clearError()
            chat.setMessages([])
            setContext(null)
          }}
          shape='square'
          size='icon-lg'
          variant='secondary'
        >
          <Icons.add className='icon-turn-button' />
        </Button>
        <Button
          aria-label='Expand chat'
          aria-pressed={expanded}
          className={cn(headerButtonClassName, 'max-sm:hidden')}
          onClick={() => setExpanded(!expanded)}
          shape='square'
          size='icon-lg'
          variant='secondary'
        >
          <IconSwap>
            <IconSwapItem
              className='inline-flex'
              key={expanded ? 'shrink' : 'expand'}
            >
              {expanded ? <Icons.shrink /> : <Icons.expand />}
            </IconSwapItem>
          </IconSwap>
        </Button>
        <Button
          aria-label='Close Simba'
          className={headerButtonClassName}
          onClick={() => setOpen(false)}
          shape='square'
          size='icon-lg'
        >
          <Icons.close className='icon-turn-button' />
        </Button>
      </div>
    </div>
  )
}
