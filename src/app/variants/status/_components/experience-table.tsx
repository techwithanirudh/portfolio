import Image from 'next/image'
import {
  formatDuration,
  formatPeriod,
  parsePeriodDate,
} from '@/lib/employment-period'
import { groupedExperience } from '../../_shared/profile'
import { StatusPill } from './status-pill'

const startOf = (value: string) => parsePeriodDate(value, 'first').getTime()

/** Every role as one row, newest first, grouped kind shown as a column. */
const rows = () =>
  groupedExperience
    .flatMap((group) =>
      group.items.flatMap((company) =>
        company.positions.map((p) => ({
          company,
          current: !p.employmentPeriod.end,
          kind: group.label,
          p,
        }))
      )
    )
    .filter((r) => r.kind !== 'Personal' || r.current)
    .sort(
      (a, b) =>
        Number(a.company.id === 'personal') -
          Number(b.company.id === 'personal') ||
        startOf(b.p.employmentPeriod.start) -
          startOf(a.p.employmentPeriod.start)
    )

export function ExperienceTable() {
  const list = rows()
  return (
    <div className='vs-card overflow-hidden'>
      <table className='w-full border-collapse text-left text-[13px]'>
        <thead className='hidden md:table-header-group'>
          <tr className='border-[var(--line)] border-b'>
            <th className='vs-label px-5 py-2.5 font-normal' scope='col'>
              Company
            </th>
            <th className='vs-label px-3 py-2.5 font-normal' scope='col'>
              Role
            </th>
            <th className='vs-label px-3 py-2.5 font-normal' scope='col'>
              Kind
            </th>
            <th className='vs-label px-3 py-2.5 font-normal' scope='col'>
              Period
            </th>
            <th
              className='vs-label px-3 py-2.5 text-right font-normal'
              scope='col'
            >
              Duration
            </th>
            <th
              className='vs-label px-5 py-2.5 text-right font-normal'
              scope='col'
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-[var(--line)]'>
          {list.map(({ company, current, kind, p }) => {
            const { start, end } = p.employmentPeriod
            const name = company.companyWebsite ? (
              <a
                className='font-medium underline-offset-4 hover:underline'
                href={company.companyWebsite}
                rel='noopener'
                target='_blank'
              >
                {company.companyName}
              </a>
            ) : (
              <span className='font-medium'>{company.companyName}</span>
            )
            return (
              <tr
                className='grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 px-4 py-3.5 md:table-row md:p-0'
                key={`${company.id}-${p.id}`}
              >
                <td className='md:px-5 md:py-3.5'>
                  <div className='flex items-center gap-3'>
                    {company.companyLogo ? (
                      <Image
                        alt=''
                        className='size-7 shrink-0 rounded-lg bg-white object-contain shadow-[var(--feature-card)]'
                        height={28}
                        src={company.companyLogo}
                        unoptimized
                        width={28}
                      />
                    ) : (
                      <span
                        aria-hidden
                        className='grid size-7 shrink-0 place-items-center rounded-lg bg-[var(--panel-raised)] font-medium text-[11px] text-[var(--muted)]'
                      >
                        {company.companyName.slice(0, 1)}
                      </span>
                    )}
                    {name}
                  </div>
                </td>
                <td className='col-start-1 row-start-2 pl-10 text-[var(--muted)] md:p-3 md:text-[var(--text)]'>
                  {p.title}
                </td>
                <td className='hidden px-3 py-3.5 text-[var(--muted)] md:table-cell'>
                  {kind}
                </td>
                <td className='vs-num col-start-1 row-start-3 pl-10 text-[12px] text-[var(--muted)] md:px-3 md:py-3.5'>
                  {formatPeriod(start, end)}
                </td>
                <td className='vs-num hidden px-3 py-3.5 text-right text-[12px] text-[var(--muted)] md:table-cell'>
                  {formatDuration(start, end) || '<1m'}
                </td>
                <td className='col-start-2 row-span-3 row-start-1 self-start text-right md:px-5 md:py-3.5'>
                  <StatusPill kind={current ? 'current' : 'completed'} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
