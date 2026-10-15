'use client'

import { format, getDay, parseISO } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import type { Activity } from '@/components/features/contributions'

const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

interface ContributionsHeatmapProps {
  data: Activity[]
}

/** A 7-row heatmap with one shared readout instead of 365 tooltips. */
export function ContributionsHeatmap({ data }: ContributionsHeatmapProps) {
  const [active, setActive] = useState<Activity | null>(null)
  const scroller = useRef<HTMLDivElement>(null)

  // Newest weeks sit on the right; start there on narrow screens.
  useEffect(() => {
    const el = scroller.current
    if (el) {
      el.scrollLeft = el.scrollWidth
    }
  }, [])

  const first = data[0]
  const pad = first ? getDay(parseISO(first.date)) : 0
  const cells: (Activity | null)[] = [...new Array(pad).fill(null), ...data]
  const weeks: (Activity | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  const months = weeks.map((week, i) => {
    const day = week.find(Boolean)
    if (!day) {
      return null
    }
    const label = format(parseISO(day.date), 'MMM')
    const prev = weeks[i - 1]?.find(Boolean)
    return !prev || format(parseISO(prev.date), 'MMM') !== label ? label : null
  })

  return (
    <div className='flex flex-col gap-3'>
      <p
        aria-live='polite'
        className='vs-num h-4 text-[12px] text-[var(--muted)]'
      >
        {active
          ? `${active.count} ${active.count === 1 ? 'contribution' : 'contributions'} on ${format(parseISO(active.date), 'EEE d MMM yyyy')}`
          : 'Hover a day for its count'}
      </p>
      <div className='-mx-1 overflow-x-auto px-1 pb-1' ref={scroller}>
        <div
          className='grid min-w-[600px] gap-x-[3px] gap-y-1'
          onPointerLeave={() => setActive(null)}
          style={{
            gridTemplateColumns: `1.75rem repeat(${weeks.length}, minmax(0, 1fr))`,
          }}
        >
          <span />
          {months.map((m, i) => (
            <span
              className='vs-num h-4 overflow-visible whitespace-nowrap text-[10px] text-[var(--muted)]'
              // biome-ignore lint/suspicious/noArrayIndexKey: weeks are positional
              key={i}
            >
              {m}
            </span>
          ))}
          {DAYS.map((label, row) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: weekday rows are positional
            <div className='contents' key={`row-${row}`}>
              <span className='vs-num self-center text-[10px] text-[var(--muted)] leading-none'>
                {label}
              </span>
              {weeks.map((week, w) => {
                const day = week[row]
                return day ? (
                  <span
                    aria-hidden
                    className='vs-heat aspect-square w-full'
                    data-level={day.level}
                    key={day.date}
                    onPointerEnter={() => setActive(day)}
                  />
                ) : (
                  // biome-ignore lint/suspicious/noArrayIndexKey: padding cells
                  <span key={`pad-${w}-${row}`} />
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className='flex items-center justify-end gap-1.5 text-[11px] text-[var(--muted)]'>
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span className='vs-heat size-2.5' data-level={l} key={l} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
