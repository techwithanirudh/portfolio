'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { ViewAnimation } from '@/components/view-animation'
import { experiences } from '@/constants/portfolio/experiences'
import { formatDuration, formatPeriod } from '@/lib/employment-period'
import { cn } from '@/lib/utils'
import type { ExperienceItemType } from '@/types/experience'

const previewCount = 3

export default function ExperiencePreview() {
  const recent = experiences.slice(0, previewCount)

  return (
    <Section className='relative w-full pt-10' id='experience'>
      <div className='flex flex-col gap-10'>
        <div className='flex flex-col items-start justify-between gap-4 px-6 sm:flex-row sm:items-end'>
          <SectionHeader
            align='left'
            description='Where I have worked recently.'
            title='Experience'
          />
          <Link
            className='inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground'
            href='/about#experience'
          >
            Full experience
            <Icons.arrowRight className='icon-arrow size-4' />
          </Link>
        </div>

        {/* Rows on small screens, a three-card grid from lg up. */}
        <div className='divider-top-dashed grid divide-y divide-dashed divide-border lg:grid-cols-3 lg:divide-x lg:divide-y-0'>
          {recent.map((experience, index) => (
            <ViewAnimation
              delay={0.05 * index}
              initial={{ opacity: 0, translateY: -6 }}
              key={experience.id}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <ExperienceCard experience={experience} />
            </ViewAnimation>
          ))}
        </div>
      </div>
    </Section>
  )
}

function ExperienceCard({ experience }: { experience: ExperienceItemType }) {
  const [position] = experience.positions
  if (!position) {
    return null
  }

  const { start, end } = position.employmentPeriod
  const duration = formatDuration(start, end)
  const isCurrent = experience.isCurrentEmployer

  return (
    <article
      className={cn(
        'flex h-full items-center gap-4 px-6 py-5',
        'lg:flex-col lg:items-stretch lg:justify-between lg:gap-20 lg:p-6',
        isCurrent && 'bg-card/60'
      )}
    >
      <div className='flex shrink-0 items-start justify-between gap-2'>
        {experience.companyLogo ? (
          <Image
            alt=''
            className='size-10 rounded-md lg:size-12 lg:rounded-lg'
            height={48}
            src={experience.companyLogo}
            width={48}
          />
        ) : (
          <span className='size-10 rounded-md bg-muted lg:size-12 lg:rounded-lg' />
        )}
        {isCurrent && <NowBadge className='hidden lg:inline-flex' />}
      </div>

      <div className='min-w-0 flex-1 lg:flex-none'>
        <div className='flex flex-wrap items-center gap-2'>
          <h3 className='font-medium text-lg lg:font-normal lg:text-2xl lg:tracking-tight'>
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
          </h3>
          {isCurrent && <NowBadge className='lg:hidden' />}
        </div>
        <p className='text-muted-foreground text-sm lg:text-base'>
          {position.title}
        </p>
        <p className='mt-1 font-mono text-muted-foreground text-xs tabular-nums lg:mt-2'>
          {formatPeriod(start, end)}
          {duration && <span className='hidden lg:inline'> · {duration}</span>}
        </p>
      </div>
    </article>
  )
}

function NowBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs',
        className
      )}
    >
      <span aria-hidden className='relative flex size-1.5'>
        <span className='absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none' />
        <span className='relative inline-flex size-1.5 rounded-full bg-primary' />
      </span>
      Now
    </span>
  )
}
