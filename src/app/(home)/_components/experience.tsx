'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { experiences } from '@/constants/portfolio/experiences'
import { formatDuration, formatPeriod } from '@/lib/employment-period'
import type { ExperienceItemType } from '@/types/experience'

const previewCount = 3

export default function ExperiencePreview() {
  const recent = experiences.slice(0, previewCount)

  return (
    <Section className='relative w-full pt-10' id='experience'>
      <div className='flex flex-col gap-10'>
        <SectionHeader
          align='left'
          className='px-6'
          description='Where I have worked recently.'
          title='Experience'
        />

        <div className='divider-top-dashed'>
          <div className='grid divide-y divide-dashed divide-border lg:grid-cols-3 lg:divide-x lg:divide-y-0'>
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

          <ViewAnimation
            blur={false}
            delay={0.05 * recent.length}
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <Link
              className={buttonVariants({
                className: 'w-full py-8 active:scale-none active:opacity-80',
                shape: 'square',
                variant: 'secondary',
              })}
              href='/about#experience'
            >
              View Full Experience
              <Icons.arrowRight className='icon-arrow-button size-5' />
            </Link>
          </ViewAnimation>
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

  return (
    <article className='flex h-full flex-col justify-between gap-6 p-6 transition-colors duration-300 hover:bg-card lg:gap-20'>
      <div className='flex items-start justify-between gap-2'>
        {experience.companyLogo ? (
          <Image
            alt=''
            className='size-12 rounded-lg icon-tilt'
            height={48}
            src={experience.companyLogo}
            width={48}
          />
        ) : (
          <span className='size-12 rounded-lg bg-muted icon-tilt' />
        )}
        {experience.isCurrentEmployer && <NowBadge />}
      </div>

      <div className='flex flex-col gap-1'>
        <h3 className='text-balance text-xl tracking-tight lg:text-2xl'>
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
        <p className='text-muted-foreground'>{position.title}</p>
        <p className='mt-2 font-mono text-muted-foreground text-xs tabular-nums'>
          {formatPeriod(start, end)}
          {duration && ` · ${duration}`}
        </p>
      </div>
    </article>
  )
}

function NowBadge() {
  return (
    <span className='inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs'>
      <span aria-hidden className='relative flex size-1.5'>
        <span className='absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none' />
        <span className='relative inline-flex size-1.5 rounded-full bg-primary' />
      </span>
      Now
    </span>
  )
}
