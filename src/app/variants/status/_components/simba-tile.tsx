'use client'

import { MessageCircle, PawPrint } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAssistantContext } from '@/components/features/assistant'
import { SimbaSleeping } from './simba-sleeping'
import { StatusPill } from './status-pill'
import { Tile, TileHeader } from './tile'
import { formatZoned } from './use-now'

/**
 * Simba's status. "Last seen" is the moment this page loaded, which is the
 * honest answer: he wakes whenever someone asks him something.
 */
export function SimbaTile() {
  const { setOpen } = useAssistantContext()
  const [seen, setSeen] = useState<string | null>(null)

  useEffect(() => {
    setSeen(formatZoned(new Date(), { hour: '2-digit', minute: '2-digit' }))
  }, [])

  return (
    <Tile className='gap-3' md={3} span={3}>
      <TileHeader
        aside={<StatusPill kind='idle' label='Asleep' />}
        icon={PawPrint}
        title='Simba'
      />
      <SimbaSleeping className='mx-auto -mb-1 w-full max-w-[11rem]' />
      <div className='mt-auto flex flex-col gap-3'>
        <p className='text-[13px] text-[var(--muted)] leading-snug'>
          Anirudh's Shih Tzu, and the voice of the site's AI chat.{' '}
          <span className='vs-num text-[12px]' suppressHydrationWarning>
            Last seen {seen ?? '--:--'} IST.
          </span>
        </p>
        <button
          className='group inline-flex h-9 items-center justify-between gap-2 rounded-lg bg-[var(--panel-raised)] px-3 font-medium text-[13px] transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_14%,var(--panel-raised))]'
          onClick={() => setOpen(true)}
          type='button'
        >
          <span className='inline-flex items-center gap-2'>
            <MessageCircle
              aria-hidden
              className='size-4 text-[var(--accent)]'
            />
            Ask Simba
          </span>
          <kbd className='vs-num text-[11px] text-[var(--muted)]'>⌘ /</kbd>
        </button>
      </div>
    </Tile>
  )
}
