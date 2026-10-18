'use client'

import { useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/button'
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

// TODO(slopradar): token-rule: clock hands and centre dot use raw neutral-400/500/600 instead of theme tokens, use bg-muted-foreground or bg-foreground/60 (x3 in this file)
const HAND_BASE_CLASSES =
  'absolute left-1/2 top-1/2 rounded-full bg-neutral-600 dark:bg-neutral-400'
// TODO(slopradar): inline-style: this is Tailwind's origin-top-left (the hands already use classes), drop HAND_ORIGIN and add the class to HAND_BASE_CLASSES
const HAND_ORIGIN = { transformOrigin: '0px 0px' }
const FACE_CLASSES =
  'relative block size-9 rotate-180 rounded-md border border-border bg-background'
const CLOCK_BUTTON_PROPS = {
  className: 'relative rounded-md after:absolute after:-inset-0.5',
  size: 'icon',
  variant: 'ghost',
} as const
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
      <Button aria-label='Clock' {...CLOCK_BUTTON_PROPS}>
        <div className={cn(FACE_CLASSES, className)}>
          <CenterDot />
        </div>
      </Button>
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
      <TooltipTrigger
        render={<Button aria-label={timeString} {...CLOCK_BUTTON_PROPS} />}
      >
        <time
          className={cn(FACE_CLASSES, className)}
          dateTime={time.toISOString()}
          style={timeStyles}
        >
          <CenterDot />

          <div
            className={cn(HAND_BASE_CLASSES, 'h-1/4 w-px')}
            style={{
              ...HAND_ORIGIN,
              transform:
                'rotate(calc((var(--time-hours) * 30deg) + ((var(--time-minutes) / 2) * 1deg))) translate(-50%, 0%)',
            }}
          />

          <div
            className={cn(HAND_BASE_CLASSES, 'h-2/5 w-px')}
            style={{
              ...HAND_ORIGIN,
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
              ...HAND_ORIGIN,
              transform:
                'rotate(calc(var(--time-seconds) * 6deg)) translate(-50%, 0%)',
            }}
          />
        </time>
      </TooltipTrigger>
      <TooltipContent>
        <p className='tabular-nums'>{timeString}</p>
      </TooltipContent>
    </Tooltip>
  )
}
