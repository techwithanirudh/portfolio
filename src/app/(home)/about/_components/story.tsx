// Journey timeline adapted from braydoncoyer.dev by Braydon Coyer (no license,
// used with attribution): https://github.com/braydoncoyer/braydoncoyer.dev/blob/master/app/about/page.tsx
import Image from 'next/image'
import { Icons } from '@/components/icons/icons'
import { InlineMarkdown } from '@/components/inline-markdown'
import { Section } from '@/components/layout/sections'
import { ViewAnimation } from '@/components/view-animation'
import { sectionIds } from '@/constants/pages'
import { story } from '@/constants/portfolio/story'
import { cn } from '@/lib/utils'
import type { StoryChapter } from '@/types'

import { ShadowBox } from './shadow-box'
import { StoryTrack } from './story-track'

export default function Story(): React.ReactElement {
  return (
    <Section className='relative w-full' id={sectionIds.story}>
      <StoryTrack className='px-6 sm:px-10'>
        <ol>
          {story.map((chapter, index) => (
            <ChapterRow chapter={chapter} index={index} key={chapter.id} />
          ))}
        </ol>
      </StoryTrack>
    </Section>
  )
}

function ChapterRow({
  chapter,
  index,
}: {
  chapter: StoryChapter
  index: number
}) {
  const photoLeft = index % 2 === 0

  return (
    <li className='group/chapter relative grid grid-cols-1 gap-8 py-12 lg:grid-cols-2 lg:items-center lg:gap-0 lg:py-20'>
      <span
        aria-hidden
        className={cn(
          'absolute inset-y-0 max-lg:hidden',
          photoLeft
            ? 'lg:left-[calc(50%-5.5rem)]'
            : 'lg:left-[calc(50%+5.5rem)]'
        )}
        data-track-lane
      />

      <ViewAnimation
        className={cn(
          'flex justify-center',
          photoLeft ? 'lg:order-1' : 'lg:order-2',
          !chapter.photo && 'max-lg:hidden'
        )}
      >
        <Snapshot
          chapter={chapter}
          eager={index === 0}
          tilt={photoLeft ? -8 : 8}
        />
      </ViewAnimation>

      <ViewAnimation
        className={cn(
          'flex max-w-[60ch] flex-col',
          photoLeft ? 'lg:order-2 lg:pl-8' : 'lg:order-1 lg:ml-auto lg:pr-8'
        )}
        delay={0.1}
      >
        <p className='mb-3 font-medium text-primary text-sm' data-track-marker>
          {chapter.when}
        </p>
        <h2 className='mb-5 text-balance font-medium text-2xl leading-tight tracking-tighter sm:text-3xl'>
          {chapter.title}
        </h2>
        <p className='text-pretty text-base text-muted-foreground leading-8'>
          <InlineMarkdown
            linkClassName='link-underline text-foreground'
            text={chapter.body}
          />
        </p>
      </ViewAnimation>
    </li>
  )
}

function Snapshot({
  chapter,
  eager = false,
  tilt,
}: {
  chapter: StoryChapter
  eager?: boolean
  tilt: number
}) {
  const { photo } = chapter

  if (!photo) {
    const Icon = chapter.icon ? Icons[chapter.icon] : null
    return (
      <ShadowBox height={278} width={188}>
        {Icon ? <Icon className='size-8 text-muted-foreground/60' /> : null}
      </ShadowBox>
    )
  }

  return (
    <div className='relative w-fit'>
      <ShadowBox height={278} label={photo.caption} width={188} />
      <div
        className={cn(
          'absolute top-0 left-0 h-[270px] w-[180px] overflow-hidden rounded-xl shadow-black/15 shadow-lg dark:shadow-black/50',
          'motion-reduce:transition-none lg:transition-transform lg:duration-300 lg:ease-out lg:group-data-reached/chapter:rotate-0 lg:hover:rotate-0',
          tilt < 0 ? 'lg:-rotate-8' : 'lg:rotate-8',
          photo.contain && 'bg-white',
          photo.letterbox
        )}
      >
        <Image
          alt={photo.alt}
          className={cn(
            photo.contain || photo.letterbox
              ? 'object-contain'
              : 'object-cover',
            photo.contain && 'p-8'
          )}
          fill
          loading={eager ? 'eager' : undefined}
          sizes='180px'
          src={photo.src}
        />
      </div>
    </div>
  )
}
