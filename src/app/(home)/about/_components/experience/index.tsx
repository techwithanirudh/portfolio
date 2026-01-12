import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import { experiences } from './data'

export default function Experience(): React.ReactElement {
  return (
    <Section>
      <div className='grid divide-y divide-dashed divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
        <div className='bg-dashed'>
          <ViewAnimation
            className='h-full'
            initial={{ opacity: 0, translateY: -8 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <div className='flex flex-col gap-1.5 p-8 sm:sticky sm:top-16'>
              <h2 className='font-semibold text-2xl'>Experience</h2>
              <p className='text-muted-foreground text-sm'>
                A quick timeline of the roles shaping my work.
              </p>
            </div>
          </ViewAnimation>
        </div>
        <div className='sm:col-span-2'>
          <div className='divide-y divide-dashed divide-border'>
            {experiences.map((experience, index) => (
              <ViewAnimation
                delay={0.6 + 0.1 * index}
                initial={{ opacity: 0, translateY: -8 }}
                key={experience.role}
                whileInView={{ opacity: 1, translateY: 0 }}
              >
                <div className='flex flex-col gap-3 p-8'>
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
