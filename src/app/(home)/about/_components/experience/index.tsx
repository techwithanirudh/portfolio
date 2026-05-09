'use client'

import { Icons } from '@/components/icons/icons'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionHeader,
  SplitSectionSidebar,
} from '@/components/sections/split-section'
import { Button } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { WorkExperience } from '@/components/work-experience'
import { experiences } from '@/constants/portfolio/experiences'

export default function Experience(): React.ReactElement {
  return (
    <SplitSection cols='three'>
      <SplitSectionSidebar background='dashed'>
        <SplitSectionHeader
          description='A quick timeline of the roles shaping my work.'
          sticky
          title='Experience'
        >
          <ViewAnimation
            delay={0.15}
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <Button asChild className='w-fit' size='sm' variant='default'>
              <a href='/resume.pdf' rel='noopener' target='_blank'>
                Resume
                <Icons.download className='inline-block' />
              </a>
            </Button>
          </ViewAnimation>
        </SplitSectionHeader>
      </SplitSectionSidebar>

      <SplitSectionContent className='px-0 py-0 lg:col-span-2'>
        <ViewAnimation
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <WorkExperience experiences={experiences} />
        </ViewAnimation>
      </SplitSectionContent>
    </SplitSection>
  )
}
