import Link from 'next/link'
import { WorkCard } from '@/components/features/work'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import type { WorkPage } from '@/lib/source'

export default function WorkPreview({ works }: { works: WorkPage[] }) {
  return (
    <Section className='relative w-full pt-10'>
      <div className='flex flex-col gap-10'>
        <SectionHeader
          align='left'
          className='px-6'
          description='A snapshot of recent projects and collaborations.'
          title='Projects'
        />
        <div className='divider-top-dashed'>
          <div className='grid grid-cols-1 divide-dashed divide-border text-left lg:grid-cols-2 lg:divide-x [&>*:last-child]:border-b-0 lg:[&>*:nth-last-child(-n+2)]:border-b-0 [&>*]:border-border [&>*]:border-b [&>*]:border-dashed'>
            {works.map((work, index) => (
              <ViewAnimation delay={0.05 * index} key={work.url}>
                <WorkCard
                  description={work.data.description ?? ''}
                  image={work.data.image ?? null}
                  slugs={work.slugs}
                  title={work.data.title ?? 'Untitled'}
                  url={work.url}
                />
              </ViewAnimation>
            ))}
          </div>

          <ViewAnimation delay={0.05 * works.length}>
            <Link
              className={buttonVariants({
                className: 'w-full py-8 active:scale-none active:opacity-80',
                shape: 'square',
                variant: 'default',
              })}
              href='/projects'
            >
              View More
              <Icons.arrowRight className='icon-arrow-button size-5' />
            </Link>
          </ViewAnimation>
        </div>
      </div>
    </Section>
  )
}
