'use client'

// Adapted from chanhdai.com (MIT, (c) Chanh Dai): https://github.com/ncdai/chanhdai.com
import { useEffect, useId, useState } from 'react'
import { InlineScript } from '@/components/inline-script'
import { IntroItem, IntroItemContent, IntroItemIcon } from './intro-item'

// Serialized with .toString() into the pre-hydration script, so these helpers
// must only touch globals and their arguments.
function clockHandsPath(hour: number, minute: number) {
  const round = (n: number) => Math.round(n * 1000) / 1000
  const minuteAngle = (minute / 60) * 2 * Math.PI
  const hourAngle = (((hour % 12) + minute / 60) / 12) * 2 * Math.PI
  const hx = round(12 + 3.6 * Math.sin(hourAngle))
  const hy = round(12 - 3.6 * Math.cos(hourAngle))
  const mx = round(12 + 6 * Math.sin(minuteAngle))
  const my = round(12 - 6 * Math.cos(minuteAngle))
  return `M12 12 L${hx} ${hy} M12 12 L${mx} ${my}`
}

function computeClock(timeZone: string) {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    timeZone,
  }).formatToParts(now)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const hour = Number.parseInt(get('hour'), 10)
  const minute = Number.parseInt(get('minute'), 10)

  const time = `${get('hour')}:${get('minute')}`
  return { hour, minute, time }
}

interface ClockIds {
  hands: string
  time: string
}

function runClockScript(
  timeZone: string,
  ids: ClockIds,
  compute: typeof computeClock,
  handsPath: typeof clockHandsPath
) {
  try {
    const { time, hour, minute } = compute(timeZone)
    const t = document.getElementById(ids.time)
    if (t) {
      t.textContent = time
    }
    const p = document.getElementById(ids.hands)
    if (p) {
      p.setAttribute('d', handsPath(hour, minute))
    }
  } catch {
    // A missing Intl zone just leaves the server placeholder in place
  }
}

const inlineScript = (timeZone: string, ids: ClockIds) =>
  `(${runClockScript.toString()})(${JSON.stringify(timeZone)},${JSON.stringify(ids)},${computeClock.toString()},${clockHandsPath.toString()})`

export function LocalTimeItem({ timeZone }: { timeZone: string }) {
  const uid = useId()
  const ids: ClockIds = {
    hands: `lt-hands-${uid}`,
    time: `lt-time-${uid}`,
  }
  const [clock, setClock] = useState<ReturnType<typeof computeClock> | null>(
    null
  )

  useEffect(() => {
    const update = () => setClock(computeClock(timeZone))
    update()
    const interval = setInterval(update, 30_000)
    return () => clearInterval(interval)
  }, [timeZone])

  return (
    <IntroItem>
      <IntroItemIcon>
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
          <path
            d={clockHandsPath(clock?.hour ?? 12, clock?.minute ?? 0)}
            id={ids.hands}
            suppressHydrationWarning
          />
        </svg>
      </IntroItemIcon>
      <IntroItemContent>
        <span className='tabular-nums' id={ids.time} suppressHydrationWarning>
          {clock?.time ?? ''}
        </span>
        <span className='text-muted-foreground'> IST</span>
      </IntroItemContent>
      <InlineScript html={inlineScript(timeZone, ids)} />
    </IntroItem>
  )
}
