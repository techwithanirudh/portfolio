import { Component } from 'lucide-react'
import Image from 'next/image'
import { Icons } from '@/components/icons/icons'
import { cn } from '@/lib/utils'
import type { HardwareItem, SoftwareItem } from '@/types'
import { plain } from '../../_shared/profile'
import {
  type Chapter,
  chapterInfo,
  type Experience,
  experienceInfo,
  toolInfo,
} from './data'
import { ImageFrame, Placeholder } from './figure'
import { PenEnd, PenPath } from './pen-path'
import { Selectable } from './selectable'
import { formatPeriod } from './selection'

export interface ChapterMedia {
  alt?: string
  label: string
  src?: string
}

function ChapterCard({
  chapter,
  index,
  media,
}: {
  chapter: Chapter
  index: number
  media: ChapterMedia
}) {
  return (
    <article className='ab-rule overflow-hidden rounded-md border bg-(--board)'>
      <div className='p-5'>
        <p className='ab-t-label flex items-center justify-between gap-3 text-(--muted)'>
          <span>{chapter.years}</span>
          <span className='text-(--path)'>
            Anchor {String(index + 1).padStart(2, '0')}
          </span>
        </p>
        <h3
          className='ab-t-heading mt-2'
          data-layer={chapter.title}
          data-layer-type='text'
        >
          {chapter.title}
        </h3>
        <p className='ab-t-body mt-2 text-(--muted)'>{chapter.body}</p>
      </div>
      {media.src ? (
        <ImageFrame
          alt={media.alt ?? ''}
          className='ab-rule aspect-[16/9] border-t'
          layer={media.label}
          sizes='(min-width: 768px) 360px, 100vw'
          src={media.src}
        />
      ) : (
        <Placeholder
          className='ab-rule aspect-[16/9] border-t'
          label={media.label}
        />
      )}
    </article>
  )
}

/** The five chapters, alternating sides of one pen path. */
export function Journey({
  chapters,
  media,
}: {
  chapters: readonly Chapter[]
  media: ChapterMedia[]
}) {
  return (
    <PenPath>
      <ol className='relative grid gap-10 md:gap-0'>
        {chapters.map((chapter, i) => {
          const left = i % 2 === 0
          return (
            <li
              className={cn(
                'grid grid-cols-[40px_minmax(0,1fr)] gap-x-3 md:grid-cols-[minmax(0,1fr)_160px_minmax(0,1fr)] md:gap-x-0',
                i > 0 && 'md:-mt-44'
              )}
              key={chapter.id}
            >
              <div className='col-start-1 row-start-1 flex md:col-start-2'>
                <span
                  className={cn(
                    'mt-7 block size-px',
                    left ? 'ml-2 md:ml-7' : 'ml-8 md:mr-7 md:ml-auto'
                  )}
                  data-anchor
                />
              </div>
              <div
                className={cn(
                  'col-start-2 row-start-1',
                  left ? 'md:col-start-1' : 'md:col-start-3'
                )}
              >
                <Selectable
                  info={chapterInfo(chapter, i)}
                  layer={`Anchor ${i + 1} / ${chapter.title}`}
                >
                  <ChapterCard
                    chapter={chapter}
                    index={i}
                    media={media[i] ?? { label: chapter.title }}
                  />
                </Selectable>
              </div>
            </li>
          )
        })}
      </ol>
      <PenEnd className='mt-14 items-start pl-1 md:items-center md:pl-0' />
    </PenPath>
  )
}

export function ExperienceGroup({
  items,
  label,
}: {
  items: Experience[]
  label: string
}) {
  const count = items.reduce((n, c) => n + c.positions.length, 0)
  return (
    <section
      className='ab-rule rounded-md border border-dashed p-4'
      data-layer={label}
      data-layer-type='group'
    >
      <h3 className='ab-t-label flex items-center justify-between text-(--muted)'>
        <span className='font-semibold text-(--ink)'>{label}</span>
        <span>
          {count} {count === 1 ? 'entry' : 'entries'}
        </span>
      </h3>
      <ul className='mt-3 grid gap-2'>
        {items.flatMap((company) =>
          company.positions.map((position) => (
            <li key={`${company.id}-${position.id}`}>
              <Selectable
                info={experienceInfo(company, position)}
                layer={`${company.companyName} / ${position.title}`}
              >
                <article className='ab-rule grid grid-cols-[32px_minmax(0,1fr)] gap-x-3 rounded-md border bg-(--board) p-3'>
                  <span className='ab-rule relative block size-8 overflow-hidden rounded border bg-(--chip)'>
                    {company.companyLogo ? (
                      <Image
                        alt=''
                        className='object-cover'
                        fill
                        sizes='32px'
                        src={company.companyLogo}
                      />
                    ) : (
                      <span className='grid size-full place-items-center text-(--muted)'>
                        <Icons.globe className='size-4' />
                      </span>
                    )}
                  </span>
                  <div className='min-w-0'>
                    <p className='flex flex-wrap items-baseline justify-between gap-x-2'>
                      <span className='font-semibold text-[13px] leading-5'>
                        {company.id === 'personal'
                          ? position.title
                          : company.companyName}
                      </span>
                      <span className='ab-t-label text-(--muted)'>
                        {formatPeriod(position.employmentPeriod)}
                      </span>
                    </p>
                    {company.id === 'personal' ? null : (
                      <p className='text-(--muted) text-[13px] leading-5'>
                        {position.title}
                      </p>
                    )}
                    <p className='mt-1 text-(--muted) text-[13px] leading-5'>
                      {plain(position.description)}
                    </p>
                  </div>
                </article>
              </Selectable>
            </li>
          ))
        )}
      </ul>
    </section>
  )
}

function ComponentName({ name }: { name: string }) {
  return (
    <p className='ab-component-name mb-1.5'>
      <Component aria-hidden className='size-3 flex-none' strokeWidth={2} />
      <span className='truncate'>{name}</span>
    </p>
  )
}

export function HardwareGrid({ items }: { items: HardwareItem[] }) {
  return (
    <ul className='grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4'>
      {items.map((item) => (
        <li key={item.name}>
          <ComponentName name={item.name} />
          <Selectable info={toolInfo(item, 'Hardware')} layer={item.name}>
            <div className='ab-rule rounded-md border bg-(--board)'>
              <span
                className='ab-img relative block aspect-[4/3] rounded-t-md'
                data-layer={`${item.name} image`}
                data-layer-type='image'
              >
                {item.image ? (
                  <Image
                    alt=''
                    className='object-contain p-4'
                    fill
                    sizes='200px'
                    src={item.image}
                  />
                ) : null}
              </span>
              <p className='ab-rule border-t px-3 py-2 text-(--muted) text-[12px] leading-4'>
                {item.description}
              </p>
            </div>
          </Selectable>
        </li>
      ))}
    </ul>
  )
}

function Logo({ logo }: { logo: SoftwareItem['logo'] }) {
  if (!logo) {
    return <span className='size-7 rounded-md bg-(--chip)' />
  }
  if (typeof logo === 'string') {
    return (
      <Image
        alt=''
        className='size-7 rounded-md'
        height={28}
        src={logo}
        width={28}
      />
    )
  }
  return (
    <>
      <Image
        alt=''
        className='size-7 rounded-md dark:hidden'
        height={28}
        src={logo.light}
        width={28}
      />
      <Image
        alt=''
        className='hidden size-7 rounded-md dark:block'
        height={28}
        src={logo.dark}
        width={28}
      />
    </>
  )
}

export function SoftwareGrid({ items }: { items: SoftwareItem[] }) {
  return (
    <ul className='grid grid-cols-1 gap-2 md:grid-cols-3 min-[480px]:grid-cols-2'>
      {items.map((item) => (
        <li key={item.name}>
          <Selectable info={toolInfo(item, 'Software')} layer={item.name}>
            <div className='ab-rule flex items-center gap-3 rounded-md border bg-(--board) p-2.5'>
              <span
                className='ab-img grid size-7 flex-none place-items-center rounded-md bg-transparent'
                data-layer={`${item.name} icon`}
                data-layer-type='image'
              >
                <Logo logo={item.logo} />
              </span>
              <span className='min-w-0'>
                <span className='block truncate font-medium text-[13px] leading-5'>
                  <a
                    className='ab-link no-underline hover:underline'
                    href={item.url}
                    rel='noopener'
                    target='_blank'
                  >
                    {item.name}
                  </a>
                  {item.featured ? (
                    <span className='ab-t-label ml-1.5 text-(--component)'>
                      ◆
                    </span>
                  ) : null}
                </span>
                <span className='block truncate text-(--muted) text-[12px] leading-4'>
                  {item.description}
                </span>
              </span>
            </div>
          </Selectable>
        </li>
      ))}
    </ul>
  )
}
