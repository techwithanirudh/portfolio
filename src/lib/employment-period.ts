import { differenceInMonths, format, parse } from 'date-fns'

/** Parses an `MM.yyyy` or `yyyy` period value; year-only values snap to January or December. */
export function parsePeriodDate(
  str: string,
  fallbackMonth: 'first' | 'last'
): Date {
  if (str.includes('.')) {
    return parse(str, 'MM.yyyy', new Date())
  }
  return parse(
    `${fallbackMonth === 'last' ? '12' : '01'}.${str}`,
    'MM.yyyy',
    new Date()
  )
}

/** Compact duration like `4m`, `2y`, or `1y 3m`; empty when the range is invalid. */
export function formatDuration(start: string, end?: string): string {
  const startHasMonth = start.includes('.')
  const endHasMonth = end ? end.includes('.') : true

  // Both year-only: granularity is years, no month arithmetic needed.
  if (!startHasMonth && end && !endHasMonth) {
    const years = Number.parseInt(end, 10) - Number.parseInt(start, 10)
    if (years <= 0) {
      return ''
    }
    return `${years}y`
  }

  const startDate = parsePeriodDate(start, 'first')
  const endDate = end ? parsePeriodDate(end, 'last') : new Date()

  // +1 to count both the start and end months inclusively.
  const totalMonths = differenceInMonths(endDate, startDate) + 1
  if (totalMonths <= 0) {
    return ''
  }

  if (totalMonths < 12) {
    return `${totalMonths}m`
  }

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  if (months === 0) {
    return `${years}y`
  }
  return `${years}y ${months}m`
}

/** Human-readable range like `Aug 2026 – Present` or `2019 – 2020`. */
export function formatPeriod(start: string, end?: string): string {
  const label = (value: string) =>
    value.includes('.')
      ? format(parsePeriodDate(value, 'first'), 'MMM yyyy')
      : value

  return `${label(start)} – ${end ? label(end) : 'Present'}`
}
