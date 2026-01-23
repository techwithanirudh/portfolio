import { ViewTransition } from 'react'
import Balancer from 'react-wrap-balancer'
import { BlurImage } from '@/components/blur-image'
import { Section } from '@/components/section'
import { TagCard } from '@/components/tags/tag-card'
import { ViewAnimation } from '@/components/view-animation'
import type { BlogPage as MDXPage } from '@/lib/source'

const frameLineClassName = 'absolute z-10 bg-zinc-500/75 mix-blend-screen'
const frameTickClassName = 'absolute z-20 hidden bg-white md:block'

const frameLines = [
  'top-6 h-px w-full md:top-12',
  'bottom-6 h-px w-full md:bottom-12',
  'left-6 h-full w-px md:left-12',
  'right-6 h-full w-px md:right-12',
]

const frameTicks = [
  'top-12 left-[44.5px] h-px w-2',
  'top-[44.5px] left-[48px] h-2 w-px',
  'top-12 right-[44.5px] h-px w-2',
  'top-[44.5px] right-[48px] h-2 w-px',
  'bottom-12 left-[44.5px] h-px w-2',
  'bottom-[44.5px] left-[48px] h-2 w-px',
  'bottom-12 right-[44.5px] h-px w-2',
  'bottom-[44.5px] right-[48px] h-2 w-px',
]

const formatPostDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

interface HeaderProps {
  page: MDXPage
  tags?: string[]
}

export const Header = ({ page, tags }: HeaderProps) => {
  const image = page.data.image
  const formattedDate = formatPostDate(page.data.date)
  const transitionName = page.slugs.join('/')

  return (
    <Section>
      <div className='relative h-[350px] md:h-[600px]'>
        {frameLines.map((line) => (
          <span
            className={`${frameLineClassName} ${line}`}
            key={`line-${line}`}
          />
        ))}
        {frameTicks.map((tick) => (
          <span
            className={`${frameTickClassName} ${tick}`}
            key={`tick-${tick}`}
          />
        ))}
        <div className='relative flex h-full w-full flex-col justify-end overflow-hidden rounded-2xl shadow-xl'>
          {image ? (
            <ViewTransition name={`${transitionName}-image`} share='via-blur'>
              <BlurImage
                alt={page.data.title ?? 'Blog cover image'}
                className='absolute inset-0 h-full w-full'
                fill
                imageClassName='object-cover'
                sizes='(min-width: 1024px) 800px, 100vw'
                src={image}
              />
            </ViewTransition>
          ) : (
            <div className='absolute inset-0 bg-slate-900' />
          )}
          <div
            className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent'
            style={{ viewTransitionName: 'none' }}
          />
          <div className='relative z-10 mt-auto p-8 md:p-16'>
            {tags?.length ? (
              <div className='mb-4 hidden gap-2 md:flex md:flex-wrap'>
                {tags.map((tag, index) => (
                  <ViewAnimation
                    delay={0.1 + index * 0.05}
                    initial={{ opacity: 0, translateY: -6 }}
                    key={tag}
                    whileInView={{ opacity: 1, translateY: 0 }}
                  >
                    <TagCard
                      className='border border-white/60 bg-white/10 text-white hover:bg-white/20 [&_span]:text-white [&_svg]:text-white/70'
                      name={tag}
                    />
                  </ViewAnimation>
                ))}
              </div>
            ) : null}
            <div className='mb-4 space-y-4 text-balance'>
              <ViewTransition name={transitionName} share='via-blur'>
                <h1 className='typography-hero max-w-2xl font-medium text-4xl text-white leading-[45px] tracking-tight md:text-5xl md:leading-[60px]'>
                  <Balancer>{page.data.title ?? 'Untitled'}</Balancer>
                </h1>
              </ViewTransition>
              <ViewTransition
                name={`${transitionName}-description`}
                share='via-blur'
              >
                <p className='typography-body hidden max-w-3xl text-slate-100 leading-8 md:block'>
                  <Balancer>{page.data.description ?? ''}</Balancer>
                </p>
              </ViewTransition>
            </div>
            <div className='flex items-center gap-6 text-slate-200 text-xs'>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
