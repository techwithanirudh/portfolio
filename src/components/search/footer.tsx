'use client'

import { useCommandState } from 'cmdk'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Separator } from '@/components/ui/separator'
import { COMMAND_META_MAP } from '@/constants/search'
import type { CommandKind } from '@/types/search'
import { CornerDownLeftIcon } from 'lucide-react'

const ENTER_LABELS: Record<CommandKind, string> = {
  command: 'Run Command',
  page: 'Go to Page',
  link: 'Open Link',
}

export function CommandMenuFooter() {
  const kind = useCommandState(
    (state): CommandKind => COMMAND_META_MAP.get(state.value) ?? 'page'
  )

  return (
    <>
      <div className='flex h-10' />
      <div className='absolute inset-x-0 bottom-0 flex h-10 items-center justify-end rounded-b-xl border-t px-4'>
        <div className='flex shrink-0 items-center gap-2 text-muted-foreground text-xs max-sm:hidden'>
          <span className='text-foreground'>{ENTER_LABELS[kind]}</span>
          <Kbd data-icon='inline-end'><CornerDownLeftIcon /></Kbd>
        </div>
      </div>
    </>
  )
}
