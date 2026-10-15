// Adapted from nelsonlai.dev/src/components/stats.tsx (MIT, © 2025 Nelson Lai). See ../NOTICES.md
import { ArrowRight, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Counter } from './counter'
import { Tile, TileHeader } from './tile'

interface Stat {
  link: string
  linkText: string
  suffix?: string
  title: string
  value: number
}

/**
 * Nelson's dashboard cards (count-up value, hover slides the value away and
 * a link label in), reduced to three numbers computed from the content.
 */
export function StatsTile({ stats }: { stats: Stat[] }) {
  return (
    <Tile md={3} span={4}>
      <TileHeader icon={BarChart3} title='By the numbers' />
      <div className='-mx-1 grid flex-1 grid-rows-3 gap-1'>
        {stats.map((stat) => (
          <Link
            className='group relative flex items-center overflow-hidden rounded-xl px-3 py-2 transition-colors hover:bg-[var(--panel-raised)] focus-visible:bg-[var(--panel-raised)]'
            href={stat.link}
            key={stat.title}
          >
            <div className='flex w-full items-baseline justify-between gap-3 transition-transform duration-200 group-hover:-translate-y-12 group-focus-visible:-translate-y-12'>
              <span className='text-[13px] text-[var(--muted)]'>
                {stat.title}
              </span>
              <span className='vs-num font-semibold text-[24px] tracking-tight'>
                <Counter value={stat.value} />
                {stat.suffix ? (
                  <span className='ml-1 font-normal text-[13px] text-[var(--muted)]'>
                    {stat.suffix}
                  </span>
                ) : null}
              </span>
            </div>
            <span className='absolute inset-x-3 top-1/2 flex translate-y-8 items-center justify-between font-medium text-[13px] opacity-0 transition duration-200 group-hover:-translate-y-1/2 group-hover:opacity-100 group-focus-visible:-translate-y-1/2 group-focus-visible:opacity-100'>
              {stat.linkText}
              <ArrowRight aria-hidden className='size-4' />
            </span>
          </Link>
        ))}
      </div>
      <p className='vs-label -mt-1'>Computed from the content</p>
    </Tile>
  )
}
