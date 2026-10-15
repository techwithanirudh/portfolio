'use client'

// Layout follows https://github.com/ncdai/chanhdai.com command menu (MIT, (c) Chánh Đại)

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
    <>
      <div className='flex h-10' />
      <div className='absolute inset-x-0 bottom-0 flex h-10 items-center justify-end gap-2 rounded-b-2xl px-4 font-medium text-xs max-sm:hidden'>
        <span>{ENTER_LABELS[kind]}</span>
        <Kbd data-icon='inline-end'>
          <Icons.cornerDownLeft />
        </Kbd>
      </div>
    </>
  )
}
