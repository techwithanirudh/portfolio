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

/** The year of an `MM.yyyy` or `yyyy` period value */
export const periodYear = (value: string) =>
  String(parsePeriodDate(value, 'first').getFullYear())

/** Months a period covers, counting both edge months; negative when the range is inverted. */
export const monthsInPeriod = (start: string, end?: string, now = new Date()) =>
  differenceInMonths(
    end ? parsePeriodDate(end, 'last') : now,
    parsePeriodDate(start, 'first')
  ) + 1

/** Compact duration like `4m`, `2y`, or `1y 3m`; empty when the range is invalid. */
export function formatDuration(start: string, end?: string): string {
  const startHasMonth = start.includes('.')
  const endHasMonth = end ? end.includes('.') : true

  if (!startHasMonth && end && !endHasMonth) {
    const years = Number.parseInt(end, 10) - Number.parseInt(start, 10)
    if (years <= 0) {
      return ''
    }
    return `${years}y`
  }

  const totalMonths = monthsInPeriod(start, end)
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
export function formatPeriod(
  start: string,
  end?: string,
  separator = ' – '
): string {
  const label = (value: string) =>
    value.includes('.')
      ? format(parsePeriodDate(value, 'first'), 'MMM yyyy')
      : value

  return `${label(start)}${separator}${end ? label(end) : 'Present'}`
}
