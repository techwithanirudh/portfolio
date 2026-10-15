import type React from 'react'
import { cn } from '@/lib/utils'
import { DrawnPath } from './drawn-path'

type Orientation = 'horizontal' | 'vertical'
type End = 'start' | 'end'

/** The arrowhead path points right; these turn it to face each end. */
const ARROW_ROTATION: Record<Orientation, Record<End, string>> = {
  horizontal: { end: '', start: 'rotate-180' },
  vertical: { end: 'rotate-90', start: '-rotate-90' },
}

/** Each half starts at the label and runs out to its end. */
const RUN_PATH: Record<Orientation, Record<End, string>> = {
  horizontal: { end: 'M0 3.5H100', start: 'M100 3.5H0' },
  vertical: { end: 'M3.5 0V100', start: 'M3.5 100V0' },
}

function Arrowhead({
  orientation,
  toward,
}: {
  orientation: Orientation
  toward: End
}) {
  const rotation = ARROW_ROTATION[orientation][toward]
  return (
    <svg
      aria-hidden
      className={cn('h-[7px] w-[9px] shrink-0', rotation)}
      fill='currentColor'
      viewBox='0 0 9 7'
    >
      <path d='M9 3.5 0 0v7z' />
    </svg>
  )
}

/** One half of the line, drawn outward from the label. */
function Run({
  orientation,
  toward,
}: {
  orientation: Orientation
  toward: End
}) {
  const horizontal = orientation === 'horizontal'
  const d = RUN_PATH[orientation][toward]
  return (
    <svg
      aria-hidden
      className={
        horizontal
          ? 'h-[7px] min-w-4 flex-[1_1_0]'
          : 'h-auto min-h-4 w-[7px] flex-[1_1_0]'
      }
      preserveAspectRatio='none'
      viewBox={horizontal ? '0 0 100 7' : '0 0 7 100'}
    >
      <DrawnPath
        d={d}
        delay={0.1}
        duration={0.5}
        fill='none'
        stroke='currentColor'
        strokeWidth={1}
      />
    </svg>
  )
}

/**
 * A drafting dimension: extension ticks at both ends, arrowheads, and the
 * measurement centred in a break in the line. The two runs draw outward from
 * the label the first time the line scrolls into view. Vertical labels read
 * bottom-to-top, the way a drawing rotates its dimension text.
 */
export function DimensionLine({
  className,
  end,
  label,
  orientation = 'horizontal',
  start,
  ...props
}: React.ComponentProps<'div'> & {
  end?: React.ReactNode
  label: React.ReactNode
  orientation?: Orientation
  start?: React.ReactNode
}) {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn(
          'flex h-full flex-col items-center text-(--ink-muted)',
          className
        )}
        {...props}
      >
        {start && <span className='ds-label mb-1.5 text-[10px]'>{start}</span>}
        <span aria-hidden className='h-px w-4 shrink-0 bg-current' />
        <Arrowhead orientation='vertical' toward='start' />
        <Run orientation='vertical' toward='start' />
        <span className='ds-label shrink-0 rotate-180 py-2 text-(--ink) [writing-mode:vertical-rl]'>
          {label}
        </span>
        <Run orientation='vertical' toward='end' />
        <Arrowhead orientation='vertical' toward='end' />
        <span aria-hidden className='h-px w-4 shrink-0 bg-current' />
        {end && <span className='ds-label mt-1.5 text-[10px]'>{end}</span>}
      </div>
    )
  }

  return (
    <div className={cn('text-(--ink-muted)', className)} {...props}>
      {(start || end) && (
        <div className='ds-label mb-1 flex justify-between'>
          <span>{start}</span>
          <span>{end}</span>
        </div>
      )}
      <div className='flex items-center'>
        <span aria-hidden className='h-4 w-px shrink-0 bg-current' />
        <Arrowhead orientation='horizontal' toward='start' />
        <Run orientation='horizontal' toward='start' />
        <span className='ds-label shrink-0 px-2 text-(--ink)'>{label}</span>
        <Run orientation='horizontal' toward='end' />
        <Arrowhead orientation='horizontal' toward='end' />
        <span aria-hidden className='h-4 w-px shrink-0 bg-current' />
      </div>
    </div>
  )
}
