'use client'

import { useAssistantContext } from '@/components/features/assistant'

export const AskSimbaLink = () => {
  const { setOpen } = useAssistantContext()

  return (
    <button
      className='link-underline cursor-pointer'
      onClick={() => setOpen(true)}
      type='button'
    >
      Ask Simba
    </button>
  )
}
