import { DownloadIcon } from 'lucide-react'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionHeader,
  SplitSectionSidebar,
} from '@/components/sections/split-section'
import { Button } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
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
                <DownloadIcon className='inline-block' />
              </a>
            </Button>
          </ViewAnimation>
        </SplitSectionHeader>
      </SplitSectionSidebar>
      <SplitSectionContent className='px-0 py-0 sm:col-span-2'>
        <div className='divide-y divide-dashed divide-border'>
          {experiences.map((experience, index) => (
            <ViewAnimation
              delay={0.05 * index}
              initial={{ opacity: 0, translateY: -6 }}
              key={`${experience.role}-${index}`}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <div className='flex flex-col gap-3 p-6 sm:p-8'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <div>
                    <h3 className='font-semibold text-lg'>{experience.role}</h3>
                    <p className='text-muted-foreground text-sm'>
                      {experience.company}
                    </p>
                  </div>
                  <span className='text-muted-foreground text-sm'>
                    {experience.timeframe}
                  </span>
                </div>
                <p className='text-muted-foreground text-sm'>
                  {experience.summary}
                </p>
              </div>
            </ViewAnimation>
          ))}
        </div>
      </SplitSectionContent>
    </SplitSection>
  )
}
