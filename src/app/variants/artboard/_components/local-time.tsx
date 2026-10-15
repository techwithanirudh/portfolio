'use client'

import { useSyncExternalStore } from 'react'

const subscribe = (tick: () => void) => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)
}

const getNow = () => Math.floor(Date.now() / 1000)
const getServerNow = () => null

/** Minutes the zone is ahead of UTC at a given instant. */
function zoneOffset(timeZone: string, instant: Date) {
  const date = new Date(Math.floor(instant.getTime() / 60_000) * 60_000)
  const parts = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    hour: 'numeric',
    hourCycle: 'h23',
    minute: 'numeric',
    month: 'numeric',
    timeZone,
    year: 'numeric',
  }).formatToParts(date)
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0)
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute')
  )
  return Math.round((asUtc - date.getTime()) / 60_000)
}

function relative(timeZone: string, date: Date) {
  const diff = zoneOffset(timeZone, date) + date.getTimezoneOffset()
  if (diff === 0) {
    return 'same time as you'
  }
  const h = Math.floor(Math.abs(diff) / 60)
  const m = Math.abs(diff) % 60
  const span = `${h}h${m ? ` ${m}m` : ''}`
  return `${span} ${diff > 0 ? 'ahead of' : 'behind'} you`
}

/** A live clock in Anirudh's time zone, with the gap to the visitor's. */
export function LocalTime({
  timeZone,
  withRelative = true,
}: {
  timeZone: string
  withRelative?: boolean
}) {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow)
  const date = now === null ? null : new Date(now * 1000)
  const time = date
    ? new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone,
      }).format(date)
    : '--:--:--'

  return (
    <span>
      <time className='ab-mono tabular-nums' suppressHydrationWarning>
        {time}
      </time>{' '}
      <span className='text-(--muted)'>IST</span>
      {withRelative ? (
        <span className='text-(--muted)'>
          {' · '}
          {date ? relative(timeZone, date) : '…'}
        </span>
      ) : null}
    </span>
  )
}
