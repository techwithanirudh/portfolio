'use client'

import { useSound } from '@web-kits/audio/react'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { toggleOn } from '@/lib/audio/minimal'
import { cn } from '@/lib/utils'
import { useChatContext } from './chat-context'
import { useAssistantContext } from './context'

// TODO(slopradar): override-cascade: aspect-square h-full w-auto override the size-8 that size='icon-sm' sets on all three buttons (they render at the h-10 bar's 40px), and [&_svg]:size-4 repeats the base, so the size variant is dead; use size='icon-lg' (size-10) and drop the overrides, checking the box stays 40px
const headerButtonClassName =
  'aspect-square h-full w-auto shadow-none ring-0 focus-visible:-outline-offset-2 [&_svg]:size-4'

export function AssistantHeader() {
  const { expanded, setContext, setExpanded, setOpen } = useAssistantContext()
  const chat = useChatContext()
  const playNewChat = useSound(toggleOn)

  return (
    <div className='sticky top-0 flex h-10 items-stretch'>
      <div className='flex min-w-0 flex-1 items-center gap-2 bg-card px-3 text-card-foreground'>
        <span className='font-medium text-sm'>Ask Simba</span>
      </div>

      <div className='flex h-full'>
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
          size='icon-sm'
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
          size='icon-sm'
          variant='secondary'
        >
          {/* TODO(slopradar): icon-swap: the expand/shrink icons hard-swap while SoundToggle and CopyStateIcon cross-fade theirs through IconSwap/IconSwapItem, use IconSwap keyed on expanded */}
          {expanded ? <Icons.shrink /> : <Icons.expand />}
        </Button>
        <Button
          aria-label='Close Simba'
          className={headerButtonClassName}
          onClick={() => setOpen(false)}
          shape='square'
          size='icon-sm'
        >
          <Icons.close className='icon-turn-button' />
        </Button>
      </div>
    </div>
  )
}
