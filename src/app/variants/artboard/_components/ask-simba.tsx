'use client'

import type { ReactNode } from 'react'
import { useAssistantContext } from '@/components/features/assistant'

/** Opens the site's real AI chat, fronted by Simba. */
export function AskSimba({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const { setOpen } = useAssistantContext()
  return (
    <button className={className} onClick={() => setOpen(true)} type='button'>
      {children}
    </button>
  )
}
