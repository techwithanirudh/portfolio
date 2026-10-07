'use client'

import Link from 'next/link'
import { WorkExperience } from '@/components/features/work'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { experiences } from '@/constants/portfolio/experiences'

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
          <WorkExperience experiences={recent} />

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
                variant: 'default',
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
