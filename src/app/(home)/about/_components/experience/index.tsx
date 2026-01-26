import {
  StickySection,
  StickySectionContent,
  StickySectionHeader,
  StickySectionSidebar,
} from '@/components/sections/sticky-section'
import { Button } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { experiences } from '@/constants/portfolio/experiences'

export default function Experience(): React.ReactElement {
  return (
    <StickySection>
      <StickySectionSidebar>
        <StickySectionHeader
          description='A quick timeline of the roles shaping my work.'
          title='Experience'
        />
        <ViewAnimation
          delay={0.15}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <Button asChild className='w-fit' size='sm' variant='outline'>
            <a href='/resume.pdf' rel='noopener' target='_blank'>
              Resume
            </a>
          </Button>
        </ViewAnimation>
      </StickySectionSidebar>
      <StickySectionContent>
        <div className='divide-y divide-dashed divide-border'>
          {experiences.map((experience, index) => (
            <ViewAnimation
              delay={0.05 * index}
              initial={{ opacity: 0, translateY: -6 }}
              key={experience.role}
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
      </StickySectionContent>
    </StickySection>
  )
}
