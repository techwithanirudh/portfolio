// Adapted from chanhdai.com/src/features/portfolio/components/overview/current-local-time-item.tsx (MIT, © 2026 Chánh Đại). See ../NOTICES.md
'use client'

import { useEffect, useState } from 'react'
import { InlineScript } from './inline-script'

/**
 * The live clock, split into an icon and a value so the hero's overview table
 * can put them in separate cells. Both halves share `id`, and the inline script
 * paints the viewer-correct values into both before hydration.
 */

const ids = (id: string): ClockIds => ({
  diff: `ds-clock-diff-${id}`,
  hands: `ds-clock-hands-${id}`,
  time: `ds-clock-time-${id}`,
})

function useClock(timeZone: string) {
  const [state, setState] = useState(() => ({
    diff: '',
    // Deterministic 12:00 for SSR; the inline script corrects it before paint.
    hands: clockHandsPath(12, 0),
    time: '',
  }))

  useEffect(() => {
    const update = () => {
      const { diff, hour, minute, time } = computeClock(timeZone)
      setState({ diff, hands: clockHandsPath(hour, minute), time })
    }
    update()
    const interval = setInterval(update, 60_000)
    return () => clearInterval(interval)
  }, [timeZone])

  return state
}

export function LocalClockIcon({
  id,
  timeZone,
}: {
  id: string
  timeZone: string
}) {
  const { hands } = useClock(timeZone)
  return (
    <svg
      aria-hidden
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle cx='12' cy='12' r='10' />
      <path d={hands} id={ids(id).hands} suppressHydrationWarning />
    </svg>
  )
}

export function LocalClockValue({
  id,
  timeZone,
  zoneLabel,
}: {
  id: string
  timeZone: string
  zoneLabel: string
}) {
  const { diff, time } = useClock(timeZone)
  const clockIds = ids(id)

  return (
    <>
      <span
        className='tabular-nums'
        id={clockIds.time}
        suppressHydrationWarning
      >
        {time}
      </span>{' '}
      <span className='text-(--ink-muted)'>{zoneLabel}</span>
      <span
        aria-hidden
        className='text-(--ink-muted)'
        id={clockIds.diff}
        suppressHydrationWarning
      >
        {diff}
      </span>
      <InlineScript html={getInlineScript(timeZone, clockIds)} />
    </>
  )
}

// Serialized via `.toString()` into the pre-hydration script, so it must stay
// self-contained: globals and arguments only, no module-scope references.
function clockHandsPath(hour: number, minute: number) {
  const h = hour % 12
  const round = (n: number) => Math.round(n * 1000) / 1000

  const minuteAngle = (minute / 60) * 2 * Math.PI
  const hourAngle = ((h + minute / 60) / 12) * 2 * Math.PI

  const hx = round(12 + 3.6 * Math.sin(hourAngle))
  const hy = round(12 - 3.6 * Math.cos(hourAngle))
  const mx = round(12 + 6 * Math.sin(minuteAngle))
  const my = round(12 - 6 * Math.cos(minuteAngle))

  return `M12 12 L${hx} ${hy} M12 12 L${mx} ${my}`
}

// Self-contained (globals only) so it can be serialized via `.toString()` into
// the pre-hydration script as well as called directly from the effect.
function computeClock(timeZone: string) {
  const now = new Date()

  const time = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    hour12: true,
    minute: '2-digit',
    timeZone,
  }).format(now)
  const hour = Number.parseInt(time, 10)
  const minute = Number.parseInt(time.slice(3), 10)

  // tz offset = (tz wall-clock instant) − (UTC wall-clock instant), each read
  // back as a local Date. In minutes, positive = east of UTC.
  const viewerOffset = -now.getTimezoneOffset()
  const targetOffset =
    (new Date(now.toLocaleString('en-US', { timeZone })).getTime() -
      new Date(now.toLocaleString('en-US', { timeZone: 'UTC' })).getTime()) /
    60_000
  const delta = Math.round(targetOffset - viewerOffset)
  const abs = Math.abs(delta)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  const span = `${h}h${m ? ` ${m}m` : ''}`
  const diff =
    abs < 1
      ? ' // same time as you'
      : ` // ${span} ${delta > 0 ? 'ahead of' : 'behind'} you`

  return { diff, hour, minute, time }
}

interface ClockIds {
  diff: string
  hands: string
  time: string
}

// Shared `compute`/`handsPath` are passed as arguments rather than referenced
// because this body is serialized via `.toString()` (globals + args only).
function runClockScript(
  timeZone: string,
  clockIds: ClockIds,
  compute: typeof computeClock,
  handsPath: typeof clockHandsPath
) {
  try {
    const { time, diff, hour, minute } = compute(timeZone)
    const t = document.getElementById(clockIds.time)
    if (t) {
      t.textContent = time
    }
    const d = document.getElementById(clockIds.diff)
    if (d) {
      d.textContent = diff
    }
    const p = document.getElementById(clockIds.hands)
    if (p) {
      p.setAttribute('d', handsPath(hour, minute))
    }
  } catch {
    // The effect paints the same values after hydration.
  }
}

// Blocking inline script that paints the viewer-local clock before hydration
// (Next.js "prevent flash before hydration"). Sharing `computeClock` with the
// effect guarantees the pre-hydration value matches what React renders.
function getInlineScript(timeZone: string, clockIds: ClockIds) {
  return `(${runClockScript.toString()})(${JSON.stringify(timeZone)},${JSON.stringify(clockIds)},${computeClock.toString()},${clockHandsPath.toString()})`
}
