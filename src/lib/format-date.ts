const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
  year: 'numeric',
})

export const formatDate = (date: Date | string | number) =>
  dateFormatter.format(new Date(date))
