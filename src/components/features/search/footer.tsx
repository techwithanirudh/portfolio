'use client'

import { useCommandState } from 'cmdk'
import { Icons } from '@/components/icons/icons'
import { Kbd } from '@/components/ui/kbd'
import { COMMAND_META_MAP } from '@/constants/search'
import type { CommandKind } from '@/types/search'

const ENTER_LABELS: Record<CommandKind, string> = {
  command: 'Run Command',
  link: 'Open Link',
  page: 'Go to Page',
}

export function CommandMenuFooter() {
  const kind = useCommandState(
    (state): CommandKind => COMMAND_META_MAP.get(state.value) ?? 'page'
  )

  return (
    <div className='flex h-10 items-center justify-end px-3 font-medium text-xs max-sm:hidden'>
      <div className='flex shrink-0 items-center gap-2'>
        <span>{ENTER_LABELS[kind]}</span>
        <Kbd data-icon='inline-end'>
          <Icons.cornerDownLeft />
        </Kbd>
      </div>
    </div>
  )
}
