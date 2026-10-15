'use client'

import { useEffect, useState } from 'react'

/**
 * The current time, ticking every `intervalMs`. `null` until mounted, so the
 * server and the first client render agree and nothing flashes a wrong time.
 */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

export const TIME_ZONE = 'Asia/Kolkata'

export const formatZoned = (date: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, ...options }).format(
    date
  )

/** Hours, minutes and seconds in IST as numbers. */
export const zonedParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    hourCycle: 'h23',
    minute: 'numeric',
    second: 'numeric',
    timeZone: TIME_ZONE,
  }).formatToParts(date)
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0)
  return { h: get('hour'), m: get('minute'), s: get('second') }
}

/** IST is UTC+05:30. Positive means IST is ahead of the visitor. */
export const offsetFromVisitor = (date: Date) => {
  const istOffset = 330
  const visitorOffset = -date.getTimezoneOffset()
  return (istOffset - visitorOffset) / 60
}

export const describeOffset = (hours: number) => {
  if (hours === 0) {
    return 'Same time as you'
  }
  const abs = Math.abs(hours)
  const value = Number.isInteger(abs) ? `${abs}` : abs.toFixed(1)
  return `${value} h ${hours > 0 ? 'ahead of' : 'behind'} you`
}
