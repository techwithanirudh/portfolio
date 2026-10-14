'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionLabel } from '@/components/layout/sections/label'
import { ViewAnimation } from '@/components/view-animation'
import { experiences } from '@/constants/portfolio/experiences'
import { formatPeriod } from '@/lib/employment-period'
import type { ExperienceItemType } from '@/types/experience'

const previewCount = 3

export default function ExperiencePreview() {
  const recent = experiences.slice(0, previewCount)

  return (
    <Section className='flex flex-col gap-4 py-6' id='experience'>
      <SectionLabel
        action={
          <Link
            className='font-mono text-muted-foreground text-xs transition-colors hover:text-foreground'
            href='/about#experience'
          >
            view_all
            <Icons.arrowRight className='icon-arrow-button ml-1 inline size-3' />
          </Link>
        }
      >
        experience
      </SectionLabel>
      <div className='divide-y divide-dashed divide-border border-border border-y border-dashed'>
        {recent.map((experience, index) => (
          <ViewAnimation
            delay={0.05 * index}
            initial={{ opacity: 0, translateY: -6 }}
            key={experience.id}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <ExperienceRow experience={experience} />
          </ViewAnimation>
        ))}
      </div>
    </Section>
  )
}

function ExperienceRow({ experience }: { experience: ExperienceItemType }) {
  const [position] = experience.positions
  if (!position) {
    return null
  }

  const { start, end } = position.employmentPeriod

  return (
    <article className='flex items-center gap-4 px-4 py-3 transition-colors duration-300 hover:bg-card sm:px-6'>
      {experience.companyLogo ? (
        <Image
          alt=''
          className='size-9 shrink-0 rounded-lg'
          height={36}
          src={experience.companyLogo}
          width={36}
        />
      ) : (
        <span className='size-9 shrink-0 rounded-lg bg-muted' />
      )}
      <div className='min-w-0 flex-1'>
        <h3 className='flex flex-wrap items-center gap-x-2 font-medium text-sm tracking-tight'>
          {experience.companyWebsite ? (
            <a
              className='transition-colors hover:text-muted-foreground'
              href={experience.companyWebsite}
              rel='noopener noreferrer'
              target='_blank'
            >
              {experience.companyName}
            </a>
          ) : (
            experience.companyName
          )}
          {experience.isCurrentEmployer && <NowBadge />}
        </h3>
        <p className='truncate text-[13px] text-muted-foreground'>
          {position.title}
        </p>
      </div>
      <p className='font-mono text-[11px] text-muted-foreground tabular-nums max-sm:hidden'>
        {formatPeriod(start, end)}
      </p>
    </article>
  )
}

function NowBadge() {
  return (
    <span className='inline-flex items-center gap-1.5 font-medium text-muted-foreground text-xs'>
      <span aria-hidden className='relative flex size-1.5'>
        <span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none' />
        <span className='relative inline-flex size-1.5 rounded-full bg-emerald-500' />
      </span>
      Now
    </span>
  )
}
