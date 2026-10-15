// Adapted from chanhdai.com/src/components/site-footer-cad.tsx (MIT, © 2026 Chánh Đại). See ../NOTICES.md
import { ArrowUpRightIcon } from 'lucide-react'
import Link from 'next/link'
import type React from 'react'
import { cn } from '@/lib/utils'
import { profile } from '../../_shared/profile'
import { type BuildInfo, getBuildInfo, getStack, sourceUrl } from './build-info'
import { currentRevision, getSheet, pad, type SheetCode, sheets } from './data'
import { SimbaStamp } from './simba-stamp'

const PROJECT = 'techwithanirudh.com'

const initials = (name: string) =>
  name
    .split(' ')
    .map((part, i, all) => (i === all.length - 1 ? part : `${part[0]}.`))
    .join(' ')

/**
 * The footer as a drawing's title block: a sheet index and contact on the left,
 * the ruled title block itself in the bottom-right corner, where a drawing
 * keeps it.
 */
export function TitleBlock({ code }: { code: SheetCode }) {
  const sheet = getSheet(code)
  const build = getBuildInfo()
  const stack = getStack()
  const socials = profile.socials.filter((s) => s.url.startsWith('http'))

  return (
    <footer className='screen-line-top'>
      <div className='stripe-divider h-12' />

      <div className='screen-line-top grid lg:grid-cols-[minmax(0,1fr)_minmax(0,600px)]'>
        <div className='flex flex-col border-(--line) max-lg:border-b lg:border-r'>
          <div className='px-4 pt-5 pb-3 md:px-6'>
            <p className='ds-label text-(--ink)'>Sheet index</p>
          </div>
          <ol className='border-(--line) border-t'>
            {sheets.map((s) => {
              const current = s.code === sheet.code
              return (
                <li
                  className='border-(--line) border-b border-dashed'
                  key={s.code}
                >
                  <Link
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'group grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-(--hover) md:px-6',
                      current ? 'text-(--ink)' : 'text-(--ink-muted)'
                    )}
                    href={s.href}
                  >
                    <span
                      className={cn(
                        'ds-label',
                        current ? 'text-(--accent)' : 'text-current'
                      )}
                    >
                      {s.code}
                    </span>
                    <span className='group-hover:text-(--ink)'>{s.title}</span>
                    <span className='ds-label text-current'>
                      {current && 'This sheet'}
                      {s.external && (
                        <span className='inline-flex items-center gap-1'>
                          Live site
                          <ArrowUpRightIcon aria-hidden className='size-3' />
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>

          <div className='px-4 pt-5 pb-1 md:px-6'>
            <p className='ds-label mb-2 text-(--ink)'>General notes</p>
            <ol className='list-inside list-decimal space-y-1 text-(--ink-muted) text-xs leading-relaxed marker:font-mono'>
              <li>
                Facts are read from the live site&apos;s content; nothing is
                retyped.
              </li>
              <li>Hatched boxes mark photos still to be supplied.</li>
              <li>All dimensions in pixels unless noted. Do not scale.</li>
            </ol>
          </div>

          <div className='mt-auto grid gap-4 px-4 py-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-10 md:px-6'>
            <div>
              <p className='ds-label mb-1.5'>Correspondence</p>
              <a
                className='ds-link whitespace-nowrap font-medium text-(--ink) [overflow-wrap:normal]'
                href={`mailto:${profile.email}`}
              >
                {profile.email}
              </a>
            </div>
            <div>
              <p className='ds-label mb-1.5'>Elsewhere</p>
              <ul className='flex flex-wrap gap-x-4 gap-y-1 text-sm'>
                {socials.map((social) => (
                  <li key={social.name}>
                    <a
                      className='ds-link text-(--ink-muted) hover:text-(--ink)'
                      href={social.url}
                      rel='noopener'
                      target='_blank'
                    >
                      {social.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <dl className='grid grid-cols-2 gap-px bg-(--line) font-mono md:grid-cols-4'>
          <Field className='md:col-span-3' label='Project'>
            <span className='font-medium'>{PROJECT}</span>
          </Field>
          <Field label='Dwg no.'>TWA-{sheet.code}</Field>

          <Field className='col-span-2 md:col-span-4' label='Title'>
            <span className='font-sans font-semibold text-[20px] tracking-tight'>
              {sheet.title}
            </span>
          </Field>

          <Field label='Drawn'>{initials(profile.name)}</Field>
          <Field className='relative md:col-span-2' label='Checked'>
            <span>Simba</span>
            <SimbaStamp
              className='pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 max-md:w-[104px] md:right-4'
              date={build.date}
            />
          </Field>
          <Field label='Scale'>1:1</Field>

          <Field label='Sheet'>
            {sheet.code} <span className='text-(--ink-muted)'>of</span>{' '}
            {pad(sheets.length)}
          </Field>
          <Field label='Rev'>
            <span className='inline-flex items-center gap-1.5'>
              <RevTriangle letter={currentRevision.letter} />
              {currentRevision.year}
            </span>
          </Field>
          <Field label='Date'>
            <time dateTime={build.date}>{build.date}</time>
          </Field>
          <Field label='Build'>
            <BuildValue build={build} />
          </Field>

          <Field className='md:col-span-2' label='Stack'>
            <ul className='flex flex-col gap-0.5'>
              {stack.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </Field>
          <Field label='Typeface'>
            <span className='flex flex-col gap-0.5'>
              <span className='font-sans'>Geist</span>
              <span>Geist Mono</span>
            </span>
          </Field>
          <Field label='Source'>
            <a
              className='ds-link'
              href={sourceUrl}
              rel='noopener'
              target='_blank'
            >
              GitHub
            </a>
          </Field>
        </dl>
      </div>

      <div className='screen-line-top flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 md:px-6'>
        <p className='ds-label'>
          © {build.date.slice(0, 4)} {profile.name}
        </p>
        <Link className='ds-label ds-link hover:text-(--ink)' href='/variants'>
          Drawing set · direction 01 of 04 · all directions
        </Link>
      </div>
      <div className='screen-line-top h-6' />
    </footer>
  )
}

export function RevTriangle({
  className,
  letter,
}: {
  className?: string
  letter: string
}) {
  return (
    <svg
      aria-label={`Revision ${letter}`}
      className={cn('size-[18px] shrink-0 text-(--redline)', className)}
      role='img'
      viewBox='0 0 18 18'
    >
      <path
        d='M9 1.5 17 16H1z'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.2'
      />
      <text
        fill='currentColor'
        fontFamily='var(--font-geist-mono), monospace'
        fontSize='8.5'
        fontWeight='700'
        textAnchor='middle'
        x='9'
        y='14.3'
      >
        {letter}
      </text>
    </svg>
  )
}

function BuildValue({ build }: { build: BuildInfo }) {
  if (!build.commitShortSha) {
    return <span className='text-(--ink-muted)'>local</span>
  }

  return (
    <>
      {build.commitUrl ? (
        <a
          className='ds-link'
          href={build.commitUrl}
          rel='noopener'
          target='_blank'
        >
          {build.commitShortSha}
        </a>
      ) : (
        build.commitShortSha
      )}
      {build.environment !== 'production' && (
        <span className='text-(--ink-muted)'> ({build.environment})</span>
      )}
    </>
  )
}

function Field({
  children,
  className,
  label,
}: {
  children: React.ReactNode
  className?: string
  label: string
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-1 bg-(--sheet) px-4 py-3',
        className
      )}
    >
      <dt className='font-medium text-(--ink-muted) text-[10px] uppercase leading-4 tracking-[0.1em]'>
        {label}
      </dt>
      <dd className='text-[13px]'>{children}</dd>
    </div>
  )
}
