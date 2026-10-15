'use client'

import { useAssistantContext } from '@/components/features/assistant'

/** Opens the site's real "Ask Simba" chat. */
export function AskSimba({ children }: { children: React.ReactNode }) {
  const { setOpen } = useAssistantContext()
  return (
    <button
      className='fn-link fn-link-pen cursor-pointer'
      onClick={() => setOpen(true)}
      type='button'
    >
      {children}
    </button>
  )
}
