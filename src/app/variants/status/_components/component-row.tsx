import { Pin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { ComponentItem } from '../_lib/timeline'
import { StatusPill } from './status-pill'
import { UptimeBar } from './uptime-bar'

const MOBILE_WINDOW = 24

interface ComponentRowProps {
  compact?: boolean
  item: ComponentItem
}

/** One project as a status-page component: name, derived status, bars. */
export function ComponentRow({ compact = false, item }: ComponentRowProps) {
  const pill = <StatusPill kind={item.status} />
  // Narrow screens drop the empty lead-in: since launch, or the last two
  // years when the project is younger than that.
  const launched = item.segments.findIndex((s) => s.state !== 'empty')
  const recent = item.segments.slice(
    Math.max(0, Math.min(launched, item.segments.length - MOBILE_WINDOW))
  )
  return (
    <li
      className={cn(
        'group/row relative grid gap-x-8 gap-y-3 px-4 py-4 transition-colors hover:bg-[color-mix(in_srgb,var(--panel-raised)_55%,transparent)] sm:px-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_7.5rem] lg:items-center',
        compact ? 'lg:py-3.5' : 'lg:py-5'
      )}
    >
      <div className='flex min-w-0 gap-4'>
        {compact || !item.image ? null : (
          <div className='relative hidden aspect-[16/10] w-20 shrink-0 self-start overflow-hidden rounded-lg bg-[var(--panel-raised)] shadow-[var(--feature-card)] sm:block'>
            <Image
              alt=''
              className='object-cover'
              fill
              sizes='80px'
              src={item.image}
            />
          </div>
        )}
        <div className='min-w-0 flex-1'>
          <div className='flex items-start justify-between gap-3'>
            <div className='flex min-w-0 items-center gap-2'>
              <Link
                className='truncate font-medium text-[15px] underline-offset-4 after:absolute after:inset-0 hover:underline'
                href={item.url}
              >
                {item.title}
              </Link>
              {item.pinned ? (
                <Pin
                  aria-label='Pinned'
                  className='size-3.5 shrink-0 rotate-45 text-[var(--muted)]'
                  role='img'
                  strokeWidth={2}
                />
              ) : null}
            </div>
            <div className='lg:hidden'>{pill}</div>
          </div>
          <p
            className={cn(
              'mt-1 text-[13px] text-[var(--muted)] leading-snug',
              compact ? 'line-clamp-1' : 'line-clamp-2'
            )}
          >
            {item.description}
          </p>
          {compact ? null : (
            <ul className='mt-2.5 flex flex-wrap gap-1.5'>
              {item.tags.map((tag) => (
                <li
                  className='vs-num rounded-md bg-[var(--panel-raised)] px-1.5 py-0.5 text-[11px] text-[var(--muted)]'
                  key={tag}
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className='relative z-10 min-w-0'>
        <UptimeBar
          className='hidden lg:block'
          gap={2}
          height={compact ? 24 : 30}
          label={`${item.title} activity by month, derived`}
          segments={item.segments}
        />
        <UptimeBar
          className='lg:hidden'
          gap={2}
          height={24}
          label={`${item.title} activity by month, derived`}
          segments={recent}
        />
        <p className='vs-num mt-1.5 flex justify-between text-[11px] text-[var(--faint)] lg:hidden'>
          <span>
            {recent[0]?.state === 'empty'
              ? `last ${MOBILE_WINDOW} months · launched ${item.launched}`
              : `since ${item.launched}`}
          </span>
          <span>now</span>
        </p>
      </div>
      <div className='hidden justify-self-end lg:block'>{pill}</div>
    </li>
  )
}

interface ComponentAxisProps {
  axis: { offset: number; year: number }[]
}

/** Year ticks for the bar column, aligned with every row's bars. */
export function ComponentAxis({ axis }: ComponentAxisProps) {
  return (
    <div className='hidden gap-x-8 border-[var(--line)] border-b px-5 py-2.5 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_7.5rem]'>
      <span className='vs-label'>Component</span>
      <div className='relative h-4'>
        {axis
          .filter((tick, i) => {
            const next = axis[i + 1]
            // A partial first year sits too close to the next tick to read.
            return !(i === 0 && next && next.offset - tick.offset < 0.08)
          })
          .map((tick) => (
            <span
              className='vs-num absolute top-0 text-[11px] text-[var(--muted)]'
              key={tick.year}
              style={{ left: `${tick.offset * 100}%` }}
            >
              <span className='absolute top-0 -left-px h-4 w-px bg-[var(--line-strong)]' />
              <span className='pl-1.5'>{tick.year}</span>
            </span>
          ))}
      </div>
      <span className='vs-label justify-self-end'>Status</span>
    </div>
  )
}
