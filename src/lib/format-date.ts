const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
  year: 'numeric',
})

const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
})

const monthDayFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'short',
  timeZone: 'UTC',
})

export const formatDate = (date: Date | string | number) =>
  dateFormatter.format(new Date(date))

/** "February 5, 2025", for a post's own header */
export const formatLongDate = (date: Date | string | number) =>
  longDateFormatter.format(new Date(date))

/** "Feb 05", for lists that already show the year somewhere else */
export const formatMonthDay = (date: Date | string | number) =>
  monthDayFormatter.format(new Date(date))
