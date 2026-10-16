import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { PreviewLink } from '@/components/preview-link'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

interface Photo {
  alt: string
  caption: string
  /** Logos sit on white with some breathing room instead of filling the frame */
  contain?: boolean
  src: string
  tilt: number
}

interface Chapter {
  body: ReactNode
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
    id: 'tinkering',
    title: 'Tinkering first',
    when: 'the beginning',
  },
  {
    body: 'The bricks turned into code. Python and some early AI experiments first, then websites and apps, and plenty of bugs that taught me more than any tutorial did.',
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
      tilt: -2,
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
      src: '/images/projects/transcript_seeker/cover.png',
      tilt: 3,
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
      tilt: -2,
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
      tilt: 3,
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

        <div className='divide-y divide-dashed divide-border border-border border-t border-dashed'>
          {chapters.map((chapter, index) => (
            <ViewAnimation delay={0.05 * index} key={chapter.id}>
              <ChapterRow chapter={chapter} />
            </ViewAnimation>
          ))}
        </div>
      </div>
    </Section>
  )
}

// Name and when on the left, the story in the middle, a polaroid on the right
function ChapterRow({ chapter }: { chapter: Chapter }) {
  return (
    <article className='group/chapter grid md:grid-cols-[16rem_1fr_13rem] md:divide-x md:divide-dashed md:divide-border'>
      <div className='px-6 pt-8 md:py-10'>
        <h3 className='font-medium text-lg'>{chapter.title}</h3>
        <p className='mt-1.5 font-mono text-muted-foreground text-xs'>
          {chapter.when}
        </p>
      </div>

      <p className='text-pretty px-6 py-4 text-muted-foreground leading-relaxed sm:text-[1.05rem] md:py-10'>
        {chapter.body}
      </p>

      {chapter.photo ? (
        <div className='flex px-6 pb-10 md:items-center md:justify-center md:py-10'>
          <Polaroid photo={chapter.photo} />
        </div>
      ) : (
        <div aria-hidden className='bg-dashed max-md:hidden' />
      )}
    </article>
  )
}

function Polaroid({ photo }: { photo: Photo }) {
  return (
    <figure
      className={cn(
        'relative w-32 rotate-(--tilt) rounded-xs border border-border bg-card p-1.5 pb-6 shadow-black/10 shadow-lg',
        'transition-transform duration-300 ease-out group-hover/chapter:translate-y-[-2px] group-hover/chapter:rotate-0',
        'motion-reduce:transition-none dark:shadow-black/40'
      )}
      style={{ '--tilt': `${photo.tilt}deg` } as CSSProperties}
    >
      <div
        className={cn(
          'relative aspect-square overflow-hidden',
          photo.contain && 'bg-white'
        )}
      >
        <Image
          alt={photo.alt}
          className={photo.contain ? 'object-contain p-6' : 'object-cover'}
          fill
          sizes='128px'
          src={photo.src}
        />
      </div>
      <figcaption className='absolute inset-x-0 bottom-1 text-center font-hand text-base text-muted-foreground leading-none'>
        {photo.caption}
      </figcaption>
    </figure>
  )
}
