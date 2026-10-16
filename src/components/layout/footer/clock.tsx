'use client'

import { useSyncExternalStore } from 'react'
import { cn } from '@/lib/utils'

interface ClockProps {
  className?: string
}

const FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'Asia/Kolkata',
})

const subscribe = (onChange: () => void) => {
  const interval = setInterval(onChange, 1000)
  return () => clearInterval(interval)
}

const getMinute = () => Math.floor(Date.now() / 60_000) * 60_000

const getServerMinute = () => null

export function Clock({ className }: ClockProps) {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute)
  const classes = cn(
    'whitespace-nowrap px-1 font-mono text-muted-foreground text-xs tabular-nums',
    className
  )

  if (minute === null) {
    return (
      <span aria-hidden className={cn(classes, 'invisible')}>
        0:00 PM IST
      </span>
    )
  }

  const date = new Date(minute)

  return (
    <time className={classes} dateTime={date.toISOString()}>
      {FORMATTER.format(date)} IST
    </time>
  )
}
