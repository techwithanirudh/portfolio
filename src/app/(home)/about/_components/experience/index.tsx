'use client'

import { WorkExperience } from '@/components/features/work'
import { Icons } from '@/components/icons/icons'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionHeader,
  SplitSectionSidebar,
} from '@/components/layout/sections/split'
import { Button } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { experiences } from '@/constants/portfolio/experiences'

export default function Experience(): React.ReactElement {
  return (
    <SplitSection cols='three' id='experience'>
      <SplitSectionSidebar background='dashed'>
        <SplitSectionHeader
          description='A timeline of the roles I have held.'
          sticky
          title='Experience'
        >
          <ViewAnimation delay={0.15}>
            <Button
              className='w-fit'
              nativeButton={false}
              render={<a href='/resume.pdf' rel='noopener' target='_blank' />}
              size='sm'
              variant='default'
            >
              Resume
              <Icons.download className='inline-block' />
            </Button>
          </ViewAnimation>
        </SplitSectionHeader>
      </SplitSectionSidebar>

      <SplitSectionContent className='px-0 py-0 lg:col-span-2'>
        <ViewAnimation>
          <WorkExperience experiences={experiences} />
        </ViewAnimation>
      </SplitSectionContent>
    </SplitSection>
  )
}
