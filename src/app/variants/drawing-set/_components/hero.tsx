import {
  AtSignIcon,
  BriefcaseBusinessIcon,
  HammerIcon,
  MapPinIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type React from 'react'
import { Icons } from '@/components/icons/icons'
import { cn } from '@/lib/utils'
import { profile } from '../../_shared/profile'
import { BalloonCallouts } from './balloon-callouts'
import { CopyButton } from './copy-button'
import { CornerFrame } from './corner-frame'
import type { WorkItem } from './data'
import { IconTile } from './icon-tile'
import { LocalClockIcon, LocalClockValue } from './local-time'

const CLOCK_ID = 'hero'

/** Inline balloon used below `lg`, where the leader overlay is hidden. */
function InlineBalloon({ n }: { n: number }) {
  return (
    <span
      aria-hidden
      className='grid size-[18px] shrink-0 place-items-center rounded-full border border-(--ink) font-mono text-(--ink) text-[10px] leading-none lg:hidden'
    >
      {n}
    </span>
  )
}

function OverviewRow({
  balloon,
  children,
  icon,
  label,
}: {
  balloon?: number
  children: React.ReactNode
  icon: React.ReactNode
  label: string
}) {
  return (
    <div className='grid grid-cols-[24px_minmax(0,1fr)] items-center gap-x-3 gap-y-1 border-(--line) border-b border-dashed px-4 py-2.5 last:border-b-0 sm:grid-cols-[24px_116px_minmax(0,1fr)] md:px-6'>
      <IconTile className='row-span-2 sm:row-span-1'>{icon}</IconTile>
      <dt className='ds-label flex items-center gap-2'>
        {balloon !== undefined && <InlineBalloon n={balloon} />}
        {label}
      </dt>
      <dd className='col-start-2 min-w-0 font-mono text-[13px] leading-5 [overflow-wrap:normal] sm:col-start-3'>
        {balloon === undefined ? (
          children
        ) : (
          <span className='inline' data-balloon={balloon}>
            {children}
          </span>
        )}
      </dd>
    </div>
  )
}

/** Small registration marks at the midpoint of each edge of the portrait. */
function EdgeMarks() {
  const base = 'absolute bg-(--ink-muted)'
  return (
    <>
      <span aria-hidden className={cn(base, '-top-2.5 left-1/2 h-1.5 w-px')} />
      <span
        aria-hidden
        className={cn(base, '-bottom-2.5 left-1/2 h-1.5 w-px')}
      />
      <span aria-hidden className={cn(base, 'top-1/2 -left-2.5 h-px w-1.5')} />
      <span aria-hidden className={cn(base, 'top-1/2 -right-2.5 h-px w-1.5')} />
    </>
  )
}

export function Hero({ latest }: { latest?: WorkItem }) {
  return (
    <section aria-labelledby='ds-hero-name' className='screen-line-bottom'>
      <BalloonCallouts className='grid lg:grid-cols-[300px_minmax(0,1fr)]'>
        <figure className='flex items-end gap-6 border-(--line) border-dashed px-4 py-7 max-lg:border-b md:px-6 lg:flex-col lg:items-center lg:justify-center lg:border-r lg:py-10'>
          <CornerFrame className='ds-portrait-wrap shrink-0'>
            <div className='relative size-[120px] overflow-hidden border border-(--line) bg-(--paper) sm:size-[148px] lg:size-[208px]'>
              <Image
                alt={`Avatar of ${profile.name}`}
                className='ds-portrait size-full object-cover'
                height={416}
                priority
                src={profile.avatar}
                width={416}
              />
            </div>
            <EdgeMarks />
          </CornerFrame>
          <figcaption className='ds-label flex flex-col gap-0.5 lg:items-center'>
            <span className='text-(--ink)'>Fig. 1</span>
            <span>Avatar · Scale 1:1</span>
          </figcaption>
        </figure>

        <div className='min-w-0 lg:pr-28'>
          <div className='px-4 pt-8 pb-7 md:px-6 lg:pt-10'>
            <p className='ds-label mb-4 flex flex-wrap items-center gap-x-2'>
              <span className='text-(--ink)'>@{profile.handle}</span>
              <span className='text-(--ink-faint)'>/</span>
              <span>Design engineer</span>
              <span className='text-(--ink-faint)'>/</span>
              <span>Full-stack developer</span>
            </p>
            <h1 className='ds-display' id='ds-hero-name'>
              {profile.name}
            </h1>
            <p className='mt-4 max-w-[52ch] text-(--ink-muted) text-lg leading-relaxed'>
              {profile.description}
            </p>
          </div>

          <dl className='border-(--line) border-t'>
            <OverviewRow
              balloon={1}
              icon={<BriefcaseBusinessIcon />}
              label='Role'
            >
              {profile.current.title}{' '}
              <span className='text-(--ink-muted)'>@</span>{' '}
              <a
                className='ds-link'
                href={profile.current.url}
                rel='noopener'
                target='_blank'
              >
                {profile.current.company}
              </a>
            </OverviewRow>
            <OverviewRow balloon={2} icon={<MapPinIcon />} label='Location'>
              {profile.location}
            </OverviewRow>
            <OverviewRow
              balloon={3}
              icon={
                <LocalClockIcon id={CLOCK_ID} timeZone={profile.timeZone} />
              }
              label='Local time'
            >
              <LocalClockValue
                id={CLOCK_ID}
                timeZone={profile.timeZone}
                zoneLabel='IST'
              />
            </OverviewRow>
            {latest && (
              <OverviewRow
                balloon={4}
                icon={<HammerIcon />}
                label='Latest build'
              >
                <Link className='ds-link' href={latest.url}>
                  {latest.title}
                </Link>{' '}
                <span className='text-(--ink-muted)'>· {latest.year}</span>
              </OverviewRow>
            )}
            <OverviewRow icon={<AtSignIcon />} label='Email'>
              <span className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                <a className='ds-link' href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
                <CopyButton label='Copy email address' value={profile.email} />
              </span>
            </OverviewRow>
            <OverviewRow icon={<Icons.github />} label='GitHub'>
              <a
                className='ds-link'
                href={`https://github.com/${profile.github}`}
                rel='noopener'
                target='_blank'
              >
                github.com/{profile.github}
              </a>
            </OverviewRow>
          </dl>
        </div>
      </BalloonCallouts>
    </section>
  )
}
