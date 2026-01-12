import { Section } from '@/components/section'
import { SectionHeader } from '@/components/sections/section-header'
import { ViewAnimation } from '@/components/view-animation'
import { WorkCard } from '@/components/work/work-card'
import type { WorkPage } from '@/lib/source'

export default function WorkPreview({ works }: { works: WorkPage[] }) {
  return (
    <Section className='relative w-full pt-10'>
      <div className='flex flex-col gap-10'>
        <ViewAnimation
          initial={{ opacity: 0, translateY: -8 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <SectionHeader
            align='left'
            className='px-6'
            description='A snapshot of recent projects and collaborations.'
            title='Selected Work'
            titleClassName='text-base font-medium'
          />
        </ViewAnimation>
        <div className='grid grid-cols-1 divide-y divide-dashed divide-border md:grid-cols-2 md:divide-x'>
          {works.map((work, index) => (
            <ViewAnimation
              delay={0.6 + 0.1 * index}
              initial={{ opacity: 0, translateY: -8 }}
              key={work.url}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <WorkCard
                description={work.data.description ?? ''}
                image={work.data.image ?? null}
                title={work.data.title ?? 'Untitled'}
                url={work.url}
              />
            </ViewAnimation>
          ))}
        </div>
      </div>
    </Section>
  )
}
