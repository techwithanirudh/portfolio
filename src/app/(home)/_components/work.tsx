import Image from 'next/image'
import Link from 'next/link'
import { ViewTransition } from 'react'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionButton } from '@/components/layout/sections/button'
import { SectionHeader } from '@/components/layout/sections/header'
import { ViewAnimation } from '@/components/view-animation'
import type { WorkPage } from '@/lib/source'

// Same shared names as the /projects cards, so a row morphs into its page
const transition = { default: 'none', 'work-card': 'via-blur' } as const

export default function WorkPreview({ works }: { works: WorkPage[] }) {
  return (
    <Section>
      <SectionHeader title='Projects' />
      <ul className='divide-y divide-line'>
        {works.map((work, index) => (
          <ViewAnimation as='li' delay={0.05 * index} key={work.url}>
            <Link
              className='group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-card'
              data-sound-hover
              href={work.url}
              transitionTypes={['work-card']}
            >
              {work.data.image ? (
                <ViewTransition
                  name={`${work.slugs.join('/')}-image`}
                  share={transition}
                >
                  <Image
                    alt=''
                    className='h-14 w-24 shrink-0 rounded-[8px] border border-line object-cover shadow-xs transition-[rotate,scale,box-shadow] duration-300 ease-out will-change-transform group-hover:-rotate-3 group-hover:scale-[1.06] group-hover:shadow-md motion-reduce:transition-none'
                    height={56}
                    sizes='96px'
                    src={work.data.image}
                    width={96}
                  />
                </ViewTransition>
              ) : (
                <span className='h-14 w-24 shrink-0 rounded-[8px] bg-muted' />
              )}
              <div className='min-w-0 flex-1'>
                <ViewTransition
                  name={`${work.slugs.join('/')}-title`}
                  share={transition}
                >
                  <h3 className='font-medium text-base tracking-tight transition-colors group-hover:text-primary'>
                    {work.data.title ?? 'Untitled'}
                  </h3>
                </ViewTransition>
                <ViewTransition
                  name={`${work.slugs.join('/')}-description`}
                  share={transition}
                >
                  <p className='line-clamp-2 text-[13px] text-muted-foreground'>
                    {work.data.description}
                  </p>
                </ViewTransition>
              </div>
              {/* Year and stack in mono, so a row scans like the resume */}
              <div className='hidden shrink-0 flex-col items-end gap-1 font-mono text-muted-foreground text-xs sm:flex'>
                <span className='text-foreground/80 tabular-nums'>
                  {new Date(work.data.date).getFullYear()}
                </span>
                {work.data.tags?.length ? (
                  <span>{work.data.tags.slice(0, 2).join(' · ')}</span>
                ) : null}
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
