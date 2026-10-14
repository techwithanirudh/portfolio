'use client'

import { useAssistantContext } from '@/components/features/assistant/assistant'

export function AskDog() {
  const { setOpen } = useAssistantContext()

  return (
    <button
      className='link-underline text-foreground'
      onClick={() => setOpen(true)}
      type='button'
    >
      ask the dog
    </button>
  )
}
