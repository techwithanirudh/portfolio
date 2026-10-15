import { getCareerYears } from '../_lib/timeline'
import { KindLegend } from './kind-legend'
import { UptimeBar } from './uptime-bar'

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

/** One row per year since 2018, twelve months each, grouped by quarter. */
export function YearUptime() {
  const years = getCareerYears().toReversed()
  return (
    <div className='vs-card overflow-hidden'>
      <div className='grid grid-cols-[3rem_1fr] items-end gap-x-4 border-[var(--line)] border-b px-4 py-2.5 sm:grid-cols-[3.5rem_1fr_7rem] sm:px-5'>
        <span className='vs-label'>Year</span>
        <div
          aria-hidden
          className='vs-num grid grid-flow-col text-center text-[11px] text-[var(--muted)]'
          style={{ gap: '3px', gridAutoColumns: 'minmax(0, 1fr)' }}
        >
          {MONTHS.map((m, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: months are positional
              key={i}
              style={{ marginLeft: i > 0 && i % 3 === 0 ? '6px' : undefined }}
            >
              <span className='hidden sm:inline'>{m}</span>
              <span className='sm:hidden'>
                {i % 3 === 0 ? `Q${i / 3 + 1}` : ''}
              </span>
            </span>
          ))}
        </div>
        <span className='vs-label hidden text-right sm:block'>Mostly</span>
      </div>
      <ul className='divide-y divide-[var(--line)]'>
        {years.map((row) => (
          <li
            className='grid grid-cols-[3rem_1fr] items-center gap-x-4 px-4 py-3 sm:grid-cols-[3.5rem_1fr_7rem] sm:px-5'
            key={row.year}
          >
            <span className='vs-num text-[13px]'>{row.year}</span>
            <UptimeBar
              gap={3}
              groupEvery={3}
              height={28}
              label={`${row.year} by month`}
              segments={row.months}
            />
            <span className='hidden truncate text-right text-[13px] text-[var(--muted)] sm:block'>
              {row.main ?? '—'}
            </span>
          </li>
        ))}
      </ul>
      <div className='flex flex-wrap items-center justify-between gap-3 border-[var(--line)] border-t px-4 py-3 sm:px-5'>
        <KindLegend />
        <p className='vs-num text-[11px] text-[var(--faint)]'>
          Derived from experience dates. Year-only eras split at mid-year.
        </p>
      </div>
    </div>
  )
}
