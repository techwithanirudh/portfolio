'use client'

import { useAssistantContext } from '@/components/features/assistant/assistant'
import { expand } from '@/lib/audio/mechanical'
import { playSound } from '@/lib/audio/preferences'

export function AskDog() {
  const { setOpen } = useAssistantContext()

  return (
    <button
      className='link-underline text-foreground'
      onClick={() => {
        playSound(expand)
        setOpen(true)
      }}
      type='button'
    >
      ask the dog
    </button>
  )
}
