'use client'

import { useSound } from '@web-kits/audio/react'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { toggleOn } from '@/lib/audio/minimal'
import { useChatContext } from './chat-context'
import { useAssistantContext } from './context'

const headerButtonClassName =
  'aspect-square h-full w-auto shadow-none ring-0 [&_svg]:size-4'

export function AssistantHeader() {
  const { setOpen, setContext } = useAssistantContext()
  const chat = useChatContext()
  const playNewChat = useSound(toggleOn)

  return (
    <div className='sticky top-0 flex h-10 items-stretch'>
      <div className='flex min-w-0 flex-1 items-center gap-2 bg-card px-3 text-card-foreground'>
        <Icons.pawPrint className='size-4 text-primary transition-transform duration-200 ease-out hover:-rotate-45 motion-reduce:transition-none' />
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
          aria-label='Close'
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
