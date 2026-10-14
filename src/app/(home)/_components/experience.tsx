'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { experiences } from '@/constants/portfolio/experiences'
import { formatPeriod } from '@/lib/employment-period'
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
          <div className='divide-y divide-dashed divide-border'>
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

function ExperienceRow({ experience }: { experience: ExperienceItemType }) {
  const [position] = experience.positions
  if (!position) {
    return null
  }

  const { start, end } = position.employmentPeriod

  return (
    <article className='flex items-center gap-4 p-4 transition-colors duration-300 hover:bg-card sm:px-6'>
      {experience.companyLogo ? (
        <Image
          alt=''
          className='size-10 shrink-0 rounded-lg'
          height={40}
          src={experience.companyLogo}
          width={40}
        />
      ) : (
        <span className='size-10 shrink-0 rounded-lg bg-muted' />
      )}
      <div className='min-w-0 flex-1'>
        <h3 className='flex flex-wrap items-center gap-x-2 text-base tracking-tight'>
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
        <p className='truncate text-muted-foreground text-sm'>
          {position.title}
        </p>
      </div>
      <p className='hidden font-mono text-muted-foreground text-xs tabular-nums sm:block'>
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
