import Image from 'next/image'
import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionButton } from '@/components/layout/sections/button'
import { SectionHeader } from '@/components/layout/sections/header'
import { ViewAnimation } from '@/components/view-animation'
import type { WorkPage } from '@/lib/source'

export default function WorkPreview({ works }: { works: WorkPage[] }) {
  return (
    <Section>
      <SectionHeader title='Projects' />
      <ul className='divide-y divide-line'>
        {works.map((work, index) => (
          <ViewAnimation
            as='li'
            blur={false}
            delay={0.05 * index}
            initial={{ opacity: 0, translateY: -6 }}
            key={work.url}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <Link
              className='group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-card'
              data-sound-hover
              href={work.url}
            >
              {work.data.image ? (
                <Image
                  alt=''
                  className='h-14 w-24 shrink-0 border border-line object-cover shadow-xs transition-[rotate,scale,box-shadow] duration-300 ease-out will-change-transform group-hover:-rotate-3 group-hover:scale-[1.06] group-hover:shadow-md motion-reduce:transition-none'
                  height={56}
                  sizes='96px'
                  src={work.data.image}
                  width={96}
                />
              ) : (
                <span className='h-14 w-24 shrink-0 bg-muted' />
              )}
              <div className='min-w-0 flex-1'>
                <h3 className='font-medium text-base tracking-tight transition-colors group-hover:text-primary'>
                  {work.data.title ?? 'Untitled'}
                </h3>
                <p className='line-clamp-2 text-[13px] text-muted-foreground'>
                  {work.data.description}
                </p>
              </div>
              <Icons.arrowRight className='size-4 shrink-0 text-muted-foreground transition-[rotate,translate,scale,color] duration-300 group-hover:-rotate-45 group-hover:text-foreground' />
            </Link>
          </ViewAnimation>
        ))}
      </ul>
      <SectionButton href='/projects'>View all projects</SectionButton>
    </Section>
  )
}
