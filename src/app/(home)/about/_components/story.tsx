// Journey timeline adapted from braydoncoyer.dev by Braydon Coyer (no license,
// used with attribution): https://github.com/braydoncoyer/braydoncoyer.dev/blob/master/app/about/page.tsx
import Image from 'next/image'
import type { ReactNode } from 'react'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { PreviewLink } from '@/components/preview-link'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

import { ShadowBox } from './shadow-box'
import { StoryTrack } from './story-track'

interface Photo {
  alt: string
  caption: string
  /** Logos sit on white with some breathing room instead of filling the frame */
  contain?: boolean
  /** Background behind a wide image shown whole instead of cropped */
  letterbox?: string
  src: string
}

interface Chapter {
  body: ReactNode
  /** Shown in the empty slot when there is no photo */
  icon?: keyof typeof Icons
  id: string
  photo?: Photo
  title: string
  when: string
}

const InlineLink = ({
  children,
  href,
}: {
  children: ReactNode
  href: string
}) => (
  <PreviewLink className='link-underline text-foreground' href={href}>
    {children}
  </PreviewLink>
)

const chapters: Chapter[] = [
  {
    body: 'It started with Lego sets as a kid: building, breaking and rebuilding whatever I could think of. Nobody taught me, which is still how I learn most things.',
    icon: 'wrench',
    id: 'tinkering',
    title: 'Tinkering first',
    when: 'the beginning',
  },
  {
    body: 'The bricks turned into code. Python and some early AI experiments first, then websites and apps, and plenty of bugs that taught me more than any tutorial did.',
    icon: 'codeXml',
    id: 'code',
    title: 'Then code',
    when: 'python, then the web',
  },
  {
    body: (
      <>
        Co-authored a research paper with Bosch on{' '}
        <InlineLink href='https://osf.io/preprints/osf/mtfpy_v1'>
          privacy challenges for autonomous vehicles
        </InlineLink>
        . My first time writing for people who check the references.
      </>
    ),
    id: 'bosch',
    photo: {
      alt: 'Bosch',
      caption: 'the paper',
      contain: true,
      src: '/images/companies/bosch.png',
    },
    title: 'A paper with Bosch',
    when: '2022',
  },
  {
    body: (
      <>
        Freelance full-stack work for MeetingBaaS:{' '}
        <InlineLink href='/projects/transcript_seeker'>
          Transcript Seeker
        </InlineLink>
        ,{' '}
        <InlineLink href='/projects/speaking_meeting_bot'>
          Speaking Meeting Bot
        </InlineLink>{' '}
        and the AI chat and MCP tooling around their meeting APIs. Then an
        internship at Energent.ai on the frontend and microservices of an AI
        data analysis platform.
      </>
    ),
    id: 'shipping',
    photo: {
      alt: 'Transcript Seeker',
      caption: 'transcript seeker',
      letterbox: 'bg-[#2b2b2b]',
      src: '/images/projects/transcript_seeker/cover.png',
    },
    title: 'Shipping for others',
    when: '2024 to 2025',
  },
  {
    body: (
      <>
        A student and a Software Engineering Intern at{' '}
        <InlineLink href='https://quiver.ai'>QuiverAI</InlineLink>, a platform
        for generating, editing and animating SVG graphics with AI. I care about
        the small details most people never notice but always feel.
      </>
    ),
    id: 'now',
    photo: {
      alt: 'QuiverAI',
      caption: 'quiver',
      contain: true,
      src: '/images/companies/quiverai.png',
    },
    title: 'These days',
    when: 'now',
  },
  {
    body: 'Simba, a shih tzu and a very good dog, is the face of the assistant in the corner of this site. He has read everything here, so you can ask him anything about me.',
    id: 'simba',
    photo: {
      alt: 'Simba the dog',
      caption: 'simba',
      src: '/images/profile.png',
    },
    title: 'Off the keyboard',
    when: 'always',
  },
]

export default function Story(): React.ReactElement {
  return (
    <Section className='relative w-full pt-10' id='story'>
      <div className='flex flex-col gap-10'>
        <SectionHeader
          align='left'
          className='px-6'
          description='How I got here.'
          title='Story'
        />

        <StoryTrack className='border-border border-t border-dashed px-6 sm:px-10'>
          <ol>
            {chapters.map((chapter, index) => (
              <ChapterRow chapter={chapter} index={index} key={chapter.id} />
            ))}
          </ol>
        </StoryTrack>
      </div>
    </Section>
  )
}

// The original alternates photo and text across two columns with the track
// running between them on the photo side. On phones the track hugs the left
// edge and the photo sits above the text
function ChapterRow({ chapter, index }: { chapter: Chapter; index: number }) {
  const photoLeft = index % 2 === 0

  return (
    <li className='relative grid grid-cols-1 gap-10 py-14 pl-10 sm:pl-14 lg:grid-cols-2 lg:items-center lg:gap-0 lg:py-20 lg:pl-0'>
      <span
        aria-hidden
        className={cn(
          'absolute inset-y-0 left-1.5 sm:left-2.5',
          photoLeft
            ? 'lg:left-[calc(50%-5.5rem)]'
            : 'lg:left-[calc(50%+5.5rem)]'
        )}
        data-track-lane
      />

      <ViewAnimation
        className={cn(
          'lg:flex lg:justify-center',
          photoLeft ? 'lg:order-1' : 'lg:order-2',
          !chapter.photo && 'max-lg:hidden'
        )}
      >
        <Snapshot chapter={chapter} tilt={photoLeft ? -8 : 8} />
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
        <h3 className='mb-5 text-balance font-medium text-2xl leading-tight tracking-tighter sm:text-3xl'>
          {chapter.title}
        </h3>
        <p className='text-pretty text-base text-muted-foreground leading-8'>
          {chapter.body}
        </p>
      </ViewAnimation>
    </li>
  )
}

// A tilted photo resting in its slot, or the empty slot with an icon
function Snapshot({ chapter, tilt }: { chapter: Chapter; tilt: number }) {
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
          'absolute top-0 left-0 h-[270px] w-[180px] overflow-hidden rounded-lg shadow-black/15 shadow-lg dark:shadow-black/50',
          'transition-transform duration-300 ease-out hover:rotate-0 motion-reduce:transition-none',
          tilt < 0 ? '-rotate-8' : 'rotate-8',
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
          sizes='180px'
          src={photo.src}
        />
      </div>
    </div>
  )
}
