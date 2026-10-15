// Adapted from jahir.dev/src/components/ui/about/activity/index.tsx and
// book.tsx (MIT, © 2022 Jahir Fiquitiva). See ../NOTICES.md
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { experiences, getWork, plain, profile } from '../../_shared/profile'
import { LocalTime } from './local-time'
import { nowPlaceholders, nowUpdated } from './notes'

function Row({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className='grid gap-x-6 gap-y-1 border-[var(--fn-rule)] border-t border-dashed py-4 first:border-t-0 sm:grid-cols-[6.5rem_1fr]'>
      <dt className='fn-label pt-1'>{label}</dt>
      <dd className='min-w-0'>{children}</dd>
    </div>
  )
}

/**
 * A /now block in the jahir.dev spirit: what he is doing this season, with
 * the date it was last true. Live facts come from the shared data; the rest
 * are labelled placeholders.
 */
export function NowCard() {
  const current = experiences.find((e) => e.id === 'quiverai')
  const role = current?.positions[0]
  const latest = getWork().toSorted(
    (a, b) => b.date.getTime() - a.date.getTime()
  )[0]

  return (
    <section
      aria-labelledby='fn-now'
      className='fn-card fn-tape relative rounded-[3px] px-5 pt-7 pb-3 sm:px-8'
      data-tape='top'
    >
      <div className='flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pb-3'>
        <h2 className='fn-serif text-[2rem] leading-none' id='fn-now'>
          Now
        </h2>
        <p className='fn-label'>
          Last updated{' '}
          <time dateTime={nowUpdated.toISOString()}>
            {format(nowUpdated, 'd MMM yyyy')}
          </time>
        </p>
      </div>
      <dl className='border-[var(--fn-pen-soft)] border-t-[1.5px]'>
        {role && current ? (
          <Row label='Building'>
            <p className='flex flex-wrap items-center gap-x-2 font-medium'>
              {role.title} at
              <a
                className='fn-link inline-flex items-center gap-1.5'
                href={current.companyWebsite}
                rel='noopener'
                target='_blank'
              >
                {current.companyLogo ? (
                  <Image
                    alt=''
                    className='size-[18px] rounded-[4px]'
                    height={18}
                    src={current.companyLogo}
                    width={18}
                  />
                ) : null}
                {current.companyName}
              </a>
            </p>
            <p className='text-[15px] text-[var(--fn-muted)]'>
              {plain(role.description)}
            </p>
          </Row>
        ) : null}
        {latest ? (
          <Row label='Shipped'>
            <p>
              <Link className='fn-link font-medium' href={latest.url}>
                {latest.title}
              </Link>
              <span className='text-[var(--fn-muted)]'>
                {' '}
                · {format(latest.date, 'MMM yyyy')}
              </span>
            </p>
            <p className='text-[15px] text-[var(--fn-muted)]'>
              {latest.description}
            </p>
          </Row>
        ) : null}
        <Row label='Learning'>
          <span className='fn-placeholder-chip whitespace-normal'>
            {nowPlaceholders.learning}
          </span>
        </Row>
        <Row label='Reading'>
          <span className='fn-placeholder-chip whitespace-normal'>
            {nowPlaceholders.reading}
          </span>
        </Row>
        <Row label='Where'>
          <p>
            {profile.location}. <LocalTime format='sentence' />
          </p>
        </Row>
      </dl>
    </section>
  )
}
