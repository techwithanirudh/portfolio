'use client'

import { type KeyboardEvent, type PointerEvent, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Segment } from '../_lib/timeline'

interface UptimeBarProps {
  className?: string
  /** Gap between bars in px. */
  gap?: number
  /** Group bars visually every N (e.g. quarters). */
  groupEvery?: number
  /** Bar height in px. */
  height?: number
  /** Accessible name for the whole row. */
  label: string
  segments: Segment[]
}

/**
 * Statuspage-style row of thin bars. One shared tooltip per row instead of a
 * tooltip per bar keeps a thousand bars cheap; arrow keys move it too.
 */
export function UptimeBar({
  className,
  gap = 2,
  groupEvery,
  height = 32,
  label,
  segments,
}: UptimeBarProps) {
  const [active, setActive] = useState<number | null>(null)
  const n = segments.length
  const current = active === null ? undefined : segments[active]

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const i = Math.floor(((e.clientX - rect.left) / rect.width) * n)
    setActive(Math.min(n - 1, Math.max(0, i)))
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      End: n,
      Home: -n,
    }
    const delta = step[e.key]
    if (delta === undefined) {
      return
    }
    e.preventDefault()
    setActive((prev) => {
      const from = prev ?? (delta > 0 ? -1 : n)
      return Math.min(n - 1, Math.max(0, from + delta))
    })
  }

  const left = active === null ? 0 : ((active + 0.5) / n) * 100
  let align: 'start' | 'center' | 'end' = 'center'
  let anchor = left
  if (left < 18) {
    align = 'start'
    anchor = Math.max(left - 2, 0)
  } else if (left > 82) {
    align = 'end'
    anchor = Math.min(left + 2, 100)
  }

  const shown = current ?? segments[n - 1]
  const valueText = shown
    ? [shown.label, shown.detail].filter(Boolean).join(', ')
    : undefined

  return (
    <div
      aria-label={label}
      // A scrubber over the bars: arrow keys or the pointer pick a month.
      aria-valuemax={n}
      aria-valuemin={1}
      aria-valuenow={(active ?? n - 1) + 1}
      aria-valuetext={valueText}
      className={cn('relative touch-pan-y outline-offset-4', className)}
      onBlur={() => setActive(null)}
      onKeyDown={onKeyDown}
      onPointerLeave={() => setActive(null)}
      onPointerMove={onPointerMove}
      role='slider'
      tabIndex={0}
    >
      <div
        aria-hidden
        className='vs-bars'
        data-hovering={active === null ? undefined : 'true'}
        style={
          {
            '--bar-gap': `${gap}px`,
            '--bar-h': `${height}px`,
          } as React.CSSProperties
        }
      >
        {segments.map((s, i) => (
          <span
            className='vs-bar'
            data-active={active === i ? 'true' : undefined}
            data-state={s.state}
            key={s.key}
            style={
              {
                '--tone': s.tone,
                marginLeft:
                  groupEvery && i > 0 && i % groupEvery === 0
                    ? `${gap * 2}px`
                    : undefined,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div
        aria-hidden={current ? undefined : true}
        className={cn(
          'pointer-events-none absolute bottom-full z-20 mb-2 w-max max-w-64 rounded-lg bg-[var(--text)] px-2.5 py-1.5 text-[12px] text-[var(--ground)] shadow-lg transition-opacity duration-100',
          current ? 'opacity-100' : 'opacity-0',
          align === 'center' && '-translate-x-1/2',
          align === 'end' && '-translate-x-full'
        )}
        style={{
          left: `${anchor}%`,
        }}
      >
        {current ? (
          <>
            <span className='vs-num block font-medium'>{current.label}</span>
            {current.detail ? (
              <span className='block opacity-75'>{current.detail}</span>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  )
}
