import { ExperienceTimeline } from '@/components/features/work'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { SectionMoreLink } from '@/components/layout/sections/more-link'
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

        <div>
          <ExperienceTimeline experiences={recent} />
          <SectionMoreLink
            delay={0.05 * recent.length}
            href='/about#experience'
          >
            View full timeline
          </SectionMoreLink>
        </div>
      </div>
    </Section>
  )
}
