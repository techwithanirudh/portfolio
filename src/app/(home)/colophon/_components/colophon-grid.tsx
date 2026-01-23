import { cn } from '@/lib/utils'

export const colophonGridClassName =
  'grid grid-cols-1 text-left sm:grid-cols-2 lg:grid-cols-3'

export const colophonCardBorderClasses = (index: number) =>
  cn(
    'border-border border-dashed',
    index > 0 && 'border-t',
    index < 2 && 'sm:border-t-0',
    index < 3 && 'lg:border-t-0',
    index % 2 === 0 && 'sm:border-r',
    index % 3 !== 2 && 'lg:border-r',
    index % 3 === 2 && 'lg:border-r-0'
  )
