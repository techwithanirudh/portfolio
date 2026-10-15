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
          action={
            <Button
              className='h-full px-5 ring-0 active:scale-100 active:opacity-90'
              nativeButton={false}
              render={<a href='/resume.pdf' rel='noopener' target='_blank' />}
              shape='square'
              variant='default'
            >
              Resume
              <Icons.download className='transition-transform group-hover/button:translate-y-0.5' />
            </Button>
          }
          description='A timeline of the roles I have held.'
          sticky
          title='Experience'
        />
      </SplitSectionSidebar>

      <SplitSectionContent>
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
