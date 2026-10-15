import Image from 'next/image'
import { formatDuration, formatPeriod } from '@/lib/employment-period'
import { cn } from '@/lib/utils'
import type { ExperienceItemType } from '@/types/experience'
import { plain } from '../../_shared/profile'
import { tilt } from './notes'

interface Entry {
  company: string
  current: boolean
  description: string
  duration: string
  key: string
  logo?: string
  period: string
  skills: string[]
  title: string
  type?: string
  website?: string
}

/** The first `[text](url)` link in a Markdown description, if any. */
const MD_LINK = /\[([^\]]+)\]\(([^)]+)\)/

export function firstLink(text = '') {
  const match = text.match(MD_LINK)
  return match ? { href: match[2], label: match[1] } : undefined
}

/** One logbook line per position, newest first, from the shared data. */
export function toEntries(items: ExperienceItemType[]): Entry[] {
  return items.flatMap((company) =>
    company.positions.map((p) => ({
      company: company.companyName,
      current: !p.employmentPeriod.end,
      description: plain(p.description),
      duration: formatDuration(
        p.employmentPeriod.start,
        p.employmentPeriod.end
      ),
      key: `${company.id}-${p.id}`,
      logo: company.companyLogo,
      period: formatPeriod(
        p.employmentPeriod.start,
        p.employmentPeriod.end
      ).replace('Present', 'now'),
      skills: p.skills ?? [],
      title: p.title,
      type: p.employmentType,
      website: company.companyWebsite,
    }))
  )
}

function Stamps({ skills }: { skills: string[] }) {
  if (skills.length === 0) {
    return null
  }
  return (
    <ul aria-label='Skills' className='mt-3 flex flex-wrap gap-x-2 gap-y-2'>
      {skills.map((skill, i) => (
        <li key={skill}>
          <span
            className='fn-stamp'
            style={
              {
                '--fn-stamp-tilt': `${tilt(i + 1, 0.35)}deg`,
              } as React.CSSProperties
            }
          >
            {skill}
          </span>
        </li>
      ))}
    </ul>
  )
}

function LogbookEntry({ entry }: { entry: Entry }) {
  return (
    <li className='grid gap-y-2 border-[var(--fn-rule)] border-t border-dashed py-6 first:border-t-0 sm:grid-cols-[11rem_1fr]'>
      <div className='fn-label flex flex-row flex-wrap gap-x-2 tabular-nums sm:flex-col sm:pt-1.5 sm:pr-4'>
        <span className={cn(entry.current && 'text-[var(--fn-pen)]')}>
          {entry.current ? (
            <span
              aria-hidden
              className='mr-1.5 inline-block size-1.5 -translate-y-px rounded-full bg-[var(--fn-pen)]'
            />
          ) : null}
          {entry.period}
        </span>
        <span>
          <span aria-hidden className='sm:hidden'>
            ·{' '}
          </span>
          {[entry.duration, entry.type].filter(Boolean).join(' · ')}
        </span>
      </div>
      <div className='min-w-0 sm:border-[var(--fn-rule)] sm:border-l sm:pl-7'>
        <h3 className='fn-serif text-[1.45rem] leading-[1.2] sm:text-[1.6rem]'>
          {entry.logo || entry.website ? (
            <>
              <span className='inline-flex items-center gap-2 align-baseline'>
                {entry.logo ? (
                  <Image
                    alt=''
                    className='size-5 translate-y-0.5 rounded-[4px] grayscale-[0.2]'
                    height={20}
                    src={entry.logo}
                    width={20}
                  />
                ) : null}
                {entry.website ? (
                  <a
                    className='fn-link'
                    href={entry.website}
                    rel='noopener'
                    target='_blank'
                  >
                    {entry.company}
                  </a>
                ) : (
                  entry.company
                )}
              </span>
              <span className='text-[var(--fn-muted)] italic'>
                {' '}
                · {entry.title}
              </span>
            </>
          ) : (
            <>
              <span className='sr-only'>{entry.company}: </span>
              {entry.title}
            </>
          )}
        </h3>
        {entry.description ? (
          <p className='fn-measure mt-1.5 text-[15.5px] text-[var(--fn-muted)]'>
            {entry.description}
          </p>
        ) : null}
        <Stamps skills={entry.skills} />
      </div>
    </li>
  )
}

export function Logbook({
  className,
  entries,
}: {
  className?: string
  entries: Entry[]
}) {
  return (
    <ol className={cn('border-[var(--fn-rule)] border-y', className)}>
      {entries.map((entry) => (
        <LogbookEntry entry={entry} key={entry.key} />
      ))}
    </ol>
  )
}
