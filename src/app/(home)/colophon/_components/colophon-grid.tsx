import { cn } from '@/lib/utils'

export const COLOPHON_COLUMNS = 3

export const colophonGridClassName =
  'grid grid-cols-1 text-left sm:grid-cols-2 lg:grid-cols-3'

export const colophonCardBorderClasses = (
  index: number,
  columns = COLOPHON_COLUMNS
) =>
  cn(
    'border-border border-dashed',
    index > 0 && 'border-t',
    index < 2 && 'sm:border-t-0',
    index % 2 === 0 && 'sm:border-r',
    columns === COLOPHON_COLUMNS && [
      index < COLOPHON_COLUMNS && 'lg:border-t-0',
      index % COLOPHON_COLUMNS !== COLOPHON_COLUMNS - 1 && 'lg:border-r',
      index % COLOPHON_COLUMNS === COLOPHON_COLUMNS - 1 && 'lg:border-r-0',
    ]
  )
