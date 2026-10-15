'use client'

import { useCommandState } from 'cmdk'
import { Icons } from '@/components/icons/icons'
import { Kbd } from '@/components/ui/kbd'
import { COMMAND_META_MAP } from '@/constants/search'
import { title } from '@/constants/site'
import type { CommandKind } from '@/types/search'

const ENTER_ACTION_LABELS: Record<CommandKind, string> = {
  command: 'Run command',
  link: 'Open link',
  page: 'Go to page',
}

export function CommandMenuFooter() {
  const kind = useCommandState(
    (state): CommandKind => COMMAND_META_MAP.get(state.value) ?? 'page'
  )

  return (
    <>
      <div className='flex h-10' />

      <div className='absolute inset-x-0 bottom-0 flex h-10 items-center justify-between gap-2 px-4 font-medium text-xs'>
        <span
          aria-hidden
          className='font-heading text-muted-foreground text-sm tracking-tighter'
        >
          {title}
        </span>

        <div className='flex items-center gap-2 max-sm:hidden'>
          <span>{ENTER_ACTION_LABELS[kind]}</span>
          <Kbd>
            <Icons.cornerDownLeft />
          </Kbd>
        </div>
      </div>
    </>
  )
}
