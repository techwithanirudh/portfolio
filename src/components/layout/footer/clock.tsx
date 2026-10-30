'use client'

import { useSyncExternalStore } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { profile } from '@/constants/portfolio/profile'
import { cn } from '@/lib/utils'

interface ClockProps {
  className?: string
}

interface TimeStyles extends React.CSSProperties {
  '--time-hours': number
  '--time-minutes': number
  '--time-seconds': number
}

const HAND_BASE_CLASSES =
  'absolute left-1/2 top-1/2 origin-top-left rounded-full bg-neutral-600 dark:bg-neutral-400'
const FACE_CLASSES =
  'relative block size-9 rotate-180 rounded-md border border-border bg-background'
const FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  hour12: true,
  minute: '2-digit',
  second: '2-digit',
  timeZone: profile.timeZone,
  timeZoneName: 'short',
})

const subscribe = (onChange: () => void) => {
  const interval = setInterval(onChange, 1000)
  return () => clearInterval(interval)
}

const getSecond = () => Math.floor(Date.now() / 1000) * 1000

const getServerSecond = () => null

const getParts = (date: Date) => {
  const parts = FORMATTER.formatToParts(date)
  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? '0'

  return {
    hours: Number.parseInt(getPart('hour'), 10) % 12,
    minutes: Number.parseInt(getPart('minute'), 10),
    seconds: Number.parseInt(getPart('second'), 10),
    timeString: FORMATTER.format(date),
  }
}

/**
 * Runs from the HTML right after the clock face, so the hands show the time on
 * the first paint instead of popping in at hydration. Stringified, so it can
 * only use globals. Keep the math in step with getParts
 */
const setHandsBeforeHydration = (timeZone: string) => {
  const face = document.currentScript?.previousElementSibling
  if (!(face instanceof HTMLElement)) {
    return
  }
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    hour12: true,
    minute: '2-digit',
    second: '2-digit',
    timeZone,
  }).formatToParts(new Date())
  const get = (type: string) =>
    Number.parseInt(parts.find((part) => part.type === type)?.value ?? '0', 10)
  face.style.setProperty('--time-hours', String(get('hour') % 12))
  face.style.setProperty('--time-minutes', String(get('minute')))
  face.style.setProperty('--time-seconds', String(get('second')))
}

const HANDS_SCRIPT = `(${setHandsBeforeHydration.toString()})(${JSON.stringify(profile.timeZone)})`

const CenterDot = () => (
  <div className='absolute top-1/2 left-1/2 size-px -translate-x-1/2 -translate-y-1/2 bg-neutral-400 dark:bg-neutral-500' />
)

export function Clock({ className }: ClockProps) {
  const second = useSyncExternalStore(subscribe, getSecond, getServerSecond)
  const time = second === null ? null : new Date(second)
  const parts = time && getParts(time)
  // Until hydration the hands are set by HANDS_SCRIPT, so the face carries no
  // time of its own and React leaves the script's values alone
  const timeStyles: TimeStyles | undefined = parts
    ? {
        '--time-hours': parts.hours,
        '--time-minutes': parts.minutes,
        '--time-seconds': parts.seconds,
      }
    : undefined

  return (
    <>
      <Tooltip>
        {/* Not a button: it does nothing, so it is a still image of the time
          that names itself, and the tooltip is for the pointer */}
        <TooltipTrigger
          render={
            <time
              aria-label={
                parts ? `My local time: ${parts.timeString}` : 'My local time'
              }
              className={cn(FACE_CLASSES, className)}
              dateTime={time?.toISOString()}
              role='img'
              style={timeStyles}
              suppressHydrationWarning
            />
          }
        >
          <CenterDot />

          <div
            className={cn(HAND_BASE_CLASSES, 'h-1/4 w-px')}
            style={{
              transform:
                'rotate(calc((var(--time-hours) * 30deg) + ((var(--time-minutes) / 2) * 1deg))) translate(-50%, 0%)',
            }}
          />

          <div
            className={cn(HAND_BASE_CLASSES, 'h-2/5 w-px')}
            style={{
              transform:
                'rotate(calc(var(--time-minutes) * 6deg)) translate(-50%, 0%)',
            }}
          />

          <div
            className={cn(
              HAND_BASE_CLASSES,
              'h-2/5 w-[0.5px] bg-neutral-500 dark:bg-neutral-400'
            )}
            style={{
              transform:
                'rotate(calc(var(--time-seconds) * 6deg)) translate(-50%, 0%)',
            }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p className='tabular-nums'>{parts?.timeString}</p>
        </TooltipContent>
      </Tooltip>
      {second === null && (
        // biome-ignore lint/security/noDangerouslySetInnerHtml: a fixed script built from our own function
        <script dangerouslySetInnerHTML={{ __html: HANDS_SCRIPT }} />
      )}
    </>
  )
}
