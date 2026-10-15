'use client'

import { Clock } from 'lucide-react'
import { Tile, TileHeader } from './tile'
import {
  describeOffset,
  formatZoned,
  offsetFromVisitor,
  useNow,
  zonedParts,
} from './use-now'

const ticks = Array.from({ length: 60 }, (_, i) => i)

/**
 * Replaces Nelson's cobe globe (not installed) with a plain SVG clock face
 * set to IST, plus how far ahead or behind the visitor that is.
 */
export function ClockTile() {
  const now = useNow(1000)
  const parts = now ? zonedParts(now) : null
  const hour = parts ? ((parts.h % 12) + parts.m / 60) * 30 : 0
  const minute = parts ? (parts.m + parts.s / 60) * 6 : 0
  const second = parts ? parts.s * 6 : 0

  return (
    <Tile md={3} span={3}>
      <TileHeader
        aside={
          <span className='vs-num text-[11px] text-[var(--muted)]'>
            UTC+05:30
          </span>
        }
        icon={Clock}
        title='Local time'
      />
      <div className='flex flex-1 flex-col items-center justify-center gap-4'>
        <svg
          aria-hidden
          className='size-[7.5rem] shrink-0'
          role='img'
          viewBox='0 0 120 120'
        >
          <circle cx='60' cy='60' fill='var(--panel-raised)' r='58' />
          <circle
            cx='60'
            cy='60'
            fill='none'
            r='58'
            stroke='var(--line)'
            strokeWidth='1'
          />
          {ticks.map((i) => {
            const major = i % 5 === 0
            return (
              <line
                key={i}
                stroke={major ? 'var(--text)' : 'var(--line-strong)'}
                strokeLinecap='round'
                strokeWidth={major ? 2 : 1}
                transform={`rotate(${i * 6} 60 60)`}
                x1='60'
                x2='60'
                y1='6'
                y2={major ? 13 : 9}
              />
            )
          })}
          <g opacity={parts ? 1 : 0}>
            <line
              stroke='var(--text)'
              strokeLinecap='round'
              strokeWidth='3.5'
              transform={`rotate(${hour} 60 60)`}
              x1='60'
              x2='60'
              y1='64'
              y2='32'
            />
            <line
              stroke='var(--text)'
              strokeLinecap='round'
              strokeWidth='2.25'
              transform={`rotate(${minute} 60 60)`}
              x1='60'
              x2='60'
              y1='66'
              y2='18'
            />
            <line
              stroke='var(--accent)'
              strokeLinecap='round'
              strokeWidth='1.25'
              transform={`rotate(${second} 60 60)`}
              x1='60'
              x2='60'
              y1='70'
              y2='14'
            />
          </g>
          <circle cx='60' cy='60' fill='var(--accent)' r='3' />
          <circle cx='60' cy='60' fill='var(--panel-raised)' r='1.25' />
        </svg>
        <div className='text-center'>
          <p className='vs-num font-medium text-[24px] leading-none tracking-tight'>
            <time dateTime={now?.toISOString()} suppressHydrationWarning>
              {now
                ? formatZoned(now, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })
                : '--:--:--'}
            </time>
          </p>
          <p
            className='mt-2 text-[12px] text-[var(--muted)]'
            suppressHydrationWarning
          >
            {now
              ? `${formatZoned(now, { day: 'numeric', month: 'short', weekday: 'short' })} · ${describeOffset(offsetFromVisitor(now))}`
              : 'India Standard Time'}
          </p>
        </div>
      </div>
    </Tile>
  )
}
