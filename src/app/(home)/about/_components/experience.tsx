import Link from 'next/link'
import { ExperienceRow } from '@/components/features/work'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { Button } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { experiences } from '@/constants/portfolio/experiences'
import type { ExperienceItemType } from '@/types/experience'

const kinds = [
  { label: 'Work', type: 'Internship' },
  { label: 'Freelance', type: 'Freelance' },
  { label: 'Research', type: undefined },
] as const

const kindOf = (experience: ExperienceItemType) =>
  experience.positions[0]?.employmentType

export default function Experience(): React.ReactElement {
  return (
    <Section className='relative w-full pt-10' id='experience'>
      <div className='flex flex-col gap-10'>
        <div className='flex flex-wrap items-end justify-between gap-6 px-6'>
          <SectionHeader
            align='left'
            description='Every role so far, newest first.'
            title='Experience'
          />
          <ViewAnimation delay={0.15}>
            <Button
              nativeButton={false}
              render={<Link href='/resume' />}
              size='sm'
              variant='outline'
            >
              Resume
              <Icons.download className='transition-transform will-change-transform group-hover/button:-rotate-12 group-hover/button:scale-125' />
            </Button>
          </ViewAnimation>
        </div>

        <div className='divide-y divide-dashed divide-border border-border border-t border-dashed'>
          {kinds.map((kind) => {
            const rows = experiences.filter(
              (experience) => kindOf(experience) === kind.type
            )
            if (rows.length === 0) {
              return null
            }

            return (
              <div key={kind.label}>
                <ViewAnimation className='flex items-center justify-between bg-muted/40 px-6 py-2 font-mono text-muted-foreground text-xs'>
                  <h3>{kind.label}</h3>
                  <span>
                    {rows.length} {rows.length === 1 ? 'role' : 'roles'}
                  </span>
                </ViewAnimation>
                <div className='divide-y divide-dashed divide-border border-border border-t border-dashed'>
                  {rows.map((experience, index) => (
                    <ViewAnimation delay={0.05 * index} key={experience.id}>
                      <ExperienceRow experience={experience} />
                    </ViewAnimation>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
