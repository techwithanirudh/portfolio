import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/section'
import { buttonVariants } from '@/components/ui/button'

import { ViewAnimation } from '@/components/view-animation'
import { WorkCard } from '@/components/work/work-card'
import type { WorkPage } from '@/lib/source'

export default function WorkPreview({ works }: { works: WorkPage[] }) {
  return (
    <Section className='relative w-full pt-10'>
      <div className='flex flex-col gap-10'>
        <ViewAnimation
          className='flex flex-col gap-2 px-6'
          initial={{ opacity: 0, translateY: -8 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <h2 className='typography-title text-left font-regular text-3xl tracking-tighter md:text-5xl'>
            Work
          </h2>
          <p className='typography-body text-left text-lg text-muted-foreground leading-relaxed tracking-tight'>
            A snapshot of recent projects and collaborations.
          </p>
        </ViewAnimation>
        <div className='w-full border-border border-t border-dashed'>
          <div className='grid grid-cols-1 divide-x divide-dashed divide-border text-left sm:grid-cols-2 [&>*:last-child]:border-b-0 sm:[&>*:nth-last-child(-n+2)]:border-b-0 [&>*]:border-border [&>*]:border-b [&>*]:border-dashed'>
            {works.map((work, index) => (
              <ViewAnimation
                delay={0.6 + 0.1 * index}
                initial={{ opacity: 0 }}
                key={work.url}
                whileInView={{ opacity: 1 }}
              >
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

          <ViewAnimation
            delay={0.6 + works.length * 0.1}
            initial={{ opacity: 0, translateY: -8 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <Link
              className={buttonVariants({
                variant: 'default',
                className: 'group w-full rounded-none py-4 sm:py-8',
              })}
              href='/work'
            >
              View More
              <Icons.arrowUpRight className='size-5 transition-transform group-hover:-rotate-12' />
            </Link>
          </ViewAnimation>
        </div>
      </div>
    </Section>
  )
}
