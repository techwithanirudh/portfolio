'use client'

import { useAssistantContext } from '@/components/features/assistant'

export const AskSimbaLink = () => {
  const { setOpen } = useAssistantContext()

  return (
    <button
      className='cursor-pointer text-fd-primary transition-colors duration-300 hover:text-fd-primary/70'
      onClick={() => setOpen(true)}
      type='button'
    >
      Ask Simba
    </button>
  )
}
