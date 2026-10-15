import { Activity, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { formatDuration, formatPeriod } from '@/lib/employment-period'
import { experiences, plain, profile } from '../../_shared/profile'
import { StatusPill } from './status-pill'
import { Tile, TileHeader } from './tile'

export function NowTile() {
  const company = experiences.find((e) => e.isCurrentEmployer && e.companyLogo)
  const role = company?.positions[0]
  if (!(company && role)) {
    return null
  }
  const { start, end } = role.employmentPeriod

  return (
    <Tile span={6}>
      <TileHeader
        aside={<StatusPill kind='current' />}
        icon={Activity}
        title='Now'
      />
      <div className='flex items-start gap-4'>
        {company.companyLogo ? (
          <Image
            alt={`${company.companyName} logo`}
            className='size-12 shrink-0 rounded-xl bg-white object-contain shadow-[var(--feature-card)]'
            height={48}
            src={company.companyLogo}
            unoptimized
            width={48}
          />
        ) : null}
        <div className='min-w-0'>
          <p className='font-semibold text-[18px] leading-snug tracking-tight'>
            {role.title}
          </p>
          <a
            className='group inline-flex items-center gap-1 text-[15px] text-[var(--muted)] transition-colors hover:text-[var(--text)]'
            href={company.companyWebsite ?? profile.current.url}
            rel='noopener'
            target='_blank'
          >
            {company.companyName}
            <ArrowUpRight
              aria-hidden
              className='size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
            />
          </a>
        </div>
      </div>
      <p className='max-w-prose text-[15px] text-[var(--muted)] leading-relaxed'>
        {plain(role.description)}
      </p>
      <dl className='mt-auto grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-[var(--line)]'>
        {[
          { label: 'Since', value: formatPeriod(start, end).split(' – ')[0] },
          { label: 'Tenure', value: formatDuration(start, end) || '<1m' },
          { label: 'Type', value: role.employmentType ?? 'Role' },
        ].map((item) => (
          <div
            className='bg-[var(--panel-raised)] px-3 py-2.5'
            key={item.label}
          >
            <dt className='vs-label'>{item.label}</dt>
            <dd className='vs-num mt-0.5 truncate text-[13px]'>{item.value}</dd>
          </div>
        ))}
      </dl>
      {role.skills?.length ? (
        <ul className='flex flex-wrap gap-1.5'>
          {role.skills.map((s) => (
            <li
              className='vs-num rounded-md bg-[var(--panel-raised)] px-2 py-0.5 text-[12px] text-[var(--muted)]'
              key={s}
            >
              {s}
            </li>
          ))}
        </ul>
      ) : null}
    </Tile>
  )
}
