import { cn } from '@/lib/utils'

export type ArrowDirection = 'left' | 'down' | 'down-left' | 'up-left' | 'right'

/** Loose ballpoint arrows, drawn for this variant. */
const arrows: Record<
  ArrowDirection,
  { viewBox: string; shaft: string; head: string; className: string }
> = {
  down: {
    className: 'h-12 w-8',
    head: 'M13.2 47.6l-5.6-7.2M13.2 47.6l6.6-6.2',
    shaft: 'M16 4c5.6 9.8 3.4 20.6-1.2 29.8-1.2 2.6-1.8 8.4-1.6 13.8',
    viewBox: '0 0 30 52',
  },
  'down-left': {
    className: 'h-12 w-14',
    head: 'M8.4 44.6l9.4-1.8M8.4 44.6l2.2-9.2',
    shaft: 'M52 4.6c.6 12.4-5.8 23.2-17.4 30.6-7.6 4.8-17.6 7.6-26.2 9.4',
    viewBox: '0 0 58 50',
  },
  left: {
    className: 'h-8 w-14',
    head: 'M5.6 17.8l8.8-5.6M5.6 17.8l9.2 4.4',
    shaft: 'M54 9.6C42.4 4.2 30.4 6 21.6 11.4c-4.6 2.8-9.6 5-16 6.4',
    viewBox: '0 0 58 28',
  },
  right: {
    className: 'h-8 w-14',
    head: 'M52.4 17.8l-8.8-5.6M52.4 17.8l-9.2 4.4',
    shaft: 'M4 9.6c11.6-5.4 23.6-3.6 32.4 1.8 4.6 2.8 9.6 5 16 6.4',
    viewBox: '0 0 58 28',
  },
  'up-left': {
    className: 'h-12 w-14',
    head: 'M8.2 6.4l9.6.8M8.2 6.4l1.4 9.4',
    shaft: 'M52 46c-1.6-12.6-9.4-22.6-21.4-29.6-6.8-4-14.2-7.4-22.4-10',
    viewBox: '0 0 58 50',
  },
}

export function HandArrow({
  className,
  direction,
}: {
  className?: string
  direction: ArrowDirection
}) {
  const arrow = arrows[direction]
  return (
    <svg
      aria-hidden
      className={cn(
        'fn-ink-stroke shrink-0 text-[var(--fn-pen)]',
        arrow.className,
        className
      )}
      strokeWidth='1.6'
      viewBox={arrow.viewBox}
    >
      <path d={arrow.shaft} />
      <path d={arrow.head} />
    </svg>
  )
}
