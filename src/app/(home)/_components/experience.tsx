import { WorkExperience } from '@/components/features/work'
import { Section } from '@/components/layout/sections'
import {
  SectionHeader,
  SectionTitleSup,
} from '@/components/layout/sections/header'
import { experiences } from '@/constants/portfolio/experiences'
import { ExperienceExpand } from './experience-expand'

const previewCount = 3

export default function ExperiencePreview() {
  const rest = experiences.slice(previewCount)

  return (
    <Section id='experience'>
      <SectionHeader
        title={
          <>
            Experience
            <SectionTitleSup>({experiences.length})</SectionTitleSup>
          </>
        }
      />
      <WorkExperience experiences={experiences.slice(0, previewCount)} />
      {rest.length > 0 && (
        <ExperienceExpand total={experiences.length}>
          <WorkExperience className='border-line border-t' experiences={rest} />
        </ExperienceExpand>
      )}
    </Section>
  )
}
