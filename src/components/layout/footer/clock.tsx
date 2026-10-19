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

const CenterDot = () => (
  <div className='absolute top-1/2 left-1/2 size-px -translate-x-1/2 -translate-y-1/2 bg-neutral-400 dark:bg-neutral-500' />
)

export function Clock({ className }: ClockProps) {
  const second = useSyncExternalStore(subscribe, getSecond, getServerSecond)

  if (second === null) {
    return (
      <div aria-hidden className={cn(FACE_CLASSES, className)}>
        <CenterDot />
      </div>
    )
  }

  const time = new Date(second)
  const { hours, minutes, seconds, timeString } = getParts(time)
  const timeStyles: TimeStyles = {
    '--time-hours': hours,
    '--time-minutes': minutes,
    '--time-seconds': seconds,
  }

  return (
    <Tooltip>
      {/* Not a button: it does nothing, so it is a still image of the time
          that names itself, and the tooltip is for the pointer */}
      <TooltipTrigger
        render={
          <time
            aria-label={`My local time: ${timeString}`}
            className={cn(FACE_CLASSES, className)}
            dateTime={time.toISOString()}
            role='img'
            style={timeStyles}
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
        <p className='tabular-nums'>{timeString}</p>
      </TooltipContent>
    </Tooltip>
  )
}
