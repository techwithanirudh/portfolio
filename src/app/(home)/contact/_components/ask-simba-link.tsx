'use client'

import { useAssistantContext } from '@/components/features/assistant'
import { SimbaChip } from '@/components/features/assistant/mascot/simba-chip'

export const AskSimbaLink = () => {
  const { setOpen } = useAssistantContext()

  return (
    <button
      aria-label='Ask Simba'
      className='link-underline cursor-pointer'
      onClick={() => setOpen(true)}
      type='button'
    >
      Ask
      <SimbaChip className='mx-[0.25em]' />
      Simba
    </button>
  )
}
