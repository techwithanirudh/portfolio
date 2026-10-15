'use client'

import { PawPrintIcon } from 'lucide-react'
import { useAssistantContext } from '@/components/features/assistant'

/** Opens the site's real "Ask Simba" chat, which the root layout mounts. */
export function AskSimbaButton() {
  const { setOpen } = useAssistantContext()

  return (
    <button
      className='inline-flex h-9 items-center gap-2 rounded-[3px] border border-(--redline)/60 bg-(--redline-wash) px-3 font-medium text-(--redline) text-sm transition-colors hover:border-(--redline)'
      onClick={() => setOpen(true)}
      type='button'
    >
      <PawPrintIcon aria-hidden className='size-4' />
      Ask Simba
    </button>
  )
}
