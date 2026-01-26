import { Section } from '@/components/section'
import { SectionHeader } from '@/components/sections/section-header'
import { Button } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { experiences } from '@/constants/portfolio/experiences'

export default function Experience(): React.ReactElement {
  return (
    <Section>
      <div className='grid divide-y divide-dashed divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
        <div className='bg-dashed'>
          <div className='flex flex-col gap-4 px-6 py-10 sm:sticky sm:top-16 sm:px-8 md:py-14'>
            <SectionHeader
              align='left'
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
          </div>
        </div>
        <div className='sm:col-span-2'>
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
                      <h3 className='font-semibold text-lg'>
                        {experience.role}
                      </h3>
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
        </div>
      </div>
    </Section>
  )
}
