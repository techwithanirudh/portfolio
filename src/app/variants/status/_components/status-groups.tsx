import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { formatDuration, formatPeriod } from '@/lib/employment-period'
import { groupedExperience, plain } from '../../_shared/profile'
import { StatusPill } from './status-pill'

/** Experience grouped by kind, each group a collapsible component group. */
export function StatusGroups() {
  return (
    <div className='flex flex-col gap-3'>
      {groupedExperience
        .filter((g) => g.items.length > 0)
        .map((group) => {
          const positions = group.items.flatMap((company) =>
            company.positions.map((p) => ({ company, p }))
          )
          const live = positions.some(({ p }) => !p.employmentPeriod.end)
          return (
            <details
              className='group vs-card overflow-hidden'
              key={group.kind}
              open
            >
              <summary className='flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 sm:px-5 [&::-webkit-details-marker]:hidden'>
                <ChevronDown
                  aria-hidden
                  className='size-4 -rotate-90 text-[var(--muted)] transition-transform group-open:rotate-0'
                />
                <span className='font-medium text-[15px]'>
                  {group.label}
                  <sup className='vs-num ml-1 font-normal text-[11px] text-[var(--muted)]'>
                    {positions.length}
                  </sup>
                </span>
                <span className='ml-auto'>
                  <StatusPill kind={live ? 'current' : 'completed'} />
                </span>
              </summary>
              <ul className='divide-y divide-[var(--line)] border-[var(--line)] border-t'>
                {positions.map(({ company, p }) => {
                  const { start, end } = p.employmentPeriod
                  return (
                    <li
                      className='grid gap-x-6 gap-y-2 px-4 py-4 sm:px-5 md:grid-cols-[minmax(0,15rem)_1fr]'
                      key={`${company.id}-${p.id}`}
                    >
                      <div className='flex items-start gap-3'>
                        {company.companyLogo ? (
                          <Image
                            alt=''
                            className='mt-0.5 size-7 shrink-0 rounded-lg bg-white object-contain shadow-[var(--feature-card)]'
                            height={28}
                            src={company.companyLogo}
                            unoptimized
                            width={28}
                          />
                        ) : (
                          <span
                            aria-hidden
                            className='mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-[var(--panel-raised)] text-[var(--muted)] [&>svg]:size-3.5'
                          >
                            {p.icon}
                          </span>
                        )}
                        <div className='min-w-0'>
                          <p className='font-medium text-[14px] leading-snug'>
                            {p.title}
                          </p>
                          <p className='text-[13px] text-[var(--muted)]'>
                            {company.companyName}
                            {p.employmentType ? ` · ${p.employmentType}` : ''}
                          </p>
                          <p className='vs-num mt-1 text-[12px] text-[var(--muted)]'>
                            {formatPeriod(start, end)} ·{' '}
                            {formatDuration(start, end) || '<1m'}
                          </p>
                        </div>
                      </div>
                      <div className='md:pt-0.5'>
                        <p className='text-[14px] text-[var(--muted)] leading-relaxed'>
                          {plain(p.description)}
                        </p>
                        {p.skills?.length ? (
                          <ul className='mt-2.5 flex flex-wrap gap-1.5'>
                            {p.skills.map((s) => (
                              <li
                                className='vs-num rounded-md bg-[var(--panel-raised)] px-1.5 py-0.5 text-[11px] text-[var(--muted)]'
                                key={s}
                              >
                                {s}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </details>
          )
        })}
    </div>
  )
}
