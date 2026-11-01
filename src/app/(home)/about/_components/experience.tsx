import Link from 'next/link'
import { ExperienceTimeline } from '@/components/features/experience/experience-timeline'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { Button } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { pages, sectionIds } from '@/constants/pages'
import { experienceIntro, experiences } from '@/constants/portfolio/experiences'

export default function Experience(): React.ReactElement {
  return (
    <Section className='relative w-full pt-10' id={sectionIds.experience}>
      <div className='flex flex-col gap-10'>
        <div className='flex flex-wrap items-end justify-between gap-6 px-6'>
          <SectionHeader
            align='left'
            description={experienceIntro}
            title='Experience'
          />
          <ViewAnimation delay={0.15}>
            <Button
              nativeButton={false}
              render={<Link href={pages.resume.path} />}
              size='sm'
              variant='outline'
            >
              Resume
              <Icons.download className='transition-transform group-hover/button:-rotate-12 group-hover/button:scale-125' />
            </Button>
          </ViewAnimation>
        </div>

        <ExperienceTimeline experiences={experiences} variant='full' />
      </div>
    </Section>
  )
}
