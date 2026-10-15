import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { BASE } from '../_lib/routes'
import { getCareerMonths, START_YEAR, yearsBuilding } from '../_lib/timeline'
import { KindLegend } from './kind-legend'
import { UptimeBar } from './uptime-bar'

/** Every month since 2018 as one bar, colored by the kind of work. */
export function CareerStrip() {
  const months = getCareerMonths()
  const covered = months.filter((m) => m.state === 'active').length
  const years = yearsBuilding()
  const pct = ((covered / months.length) * 100).toFixed(1)

  return (
    <div className='vs-card flex flex-col gap-5 p-5'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <p className='vs-label'>Uptime since {START_YEAR}</p>
          <p className='mt-1.5 flex items-baseline gap-2'>
            <span className='vs-num font-semibold text-[40px] leading-none tracking-tight'>
              {years}
            </span>
            <span className='text-[15px] text-[var(--muted)]'>
              years building
            </span>
          </p>
        </div>
        <div className='text-right'>
          <p className='vs-num font-medium text-[18px] text-[var(--ok)] leading-none'>
            {pct}%
          </p>
          <p className='vs-num mt-1.5 text-[11px] text-[var(--muted)]'>
            {covered} of {months.length} months
          </p>
        </div>
      </div>
      <div>
        <UptimeBar
          gap={2}
          height={44}
          label={`Career by month since ${START_YEAR}, colored by kind of work`}
          segments={months}
        />
        <div className='vs-num relative mt-2 h-4 text-[11px] text-[var(--muted)]'>
          {Array.from({ length: years + 1 }, (_, i) => START_YEAR + i).map(
            (year) => (
              <span
                className='absolute top-0 hidden first:block sm:block'
                key={year}
                style={{
                  left: `${(((year - START_YEAR) * 12) / months.length) * 100}%`,
                }}
              >
                {year === START_YEAR ? year : `’${String(year).slice(2)}`}
              </span>
            )
          )}
          <span className='absolute top-0 right-0 text-[var(--text)]'>Now</span>
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-3 border-[var(--line)] border-t pt-4'>
        <KindLegend />
        <Link
          className='group inline-flex items-center gap-1 text-[13px] text-[var(--muted)] transition-colors hover:text-[var(--text)]'
          href={`${BASE}/about`}
        >
          Full history
          <ArrowRight
            aria-hidden
            className='size-3.5 transition-transform group-hover:translate-x-0.5'
          />
        </Link>
      </div>
    </div>
  )
}
