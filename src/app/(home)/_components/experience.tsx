import Image from 'next/image'
import ReactMarkdown, { type Components } from 'react-markdown'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { SectionMoreLink } from '@/components/layout/sections/more-link'
import { PreviewLink } from '@/components/preview-link'
import { ViewAnimation } from '@/components/view-animation'
import { experiences } from '@/constants/portfolio/experiences'
import { formatDuration, formatPeriod } from '@/lib/employment-period'
import type { ExperienceItemType } from '@/types/experience'

const previewCount = 3

// Descriptions are markdown, kept inline so the card stays one paragraph
const markdownComponents: Components = {
  a: ({ children, href }) =>
    href ? (
      <PreviewLink
        className='text-foreground underline decoration-dashed underline-offset-4 transition-colors hover:text-primary'
        href={href}
      >
        {children}
      </PreviewLink>
    ) : (
      children
    ),
  p: ({ children }) => children,
}

export default function ExperiencePreview() {
  const recent = experiences.slice(0, previewCount)

  return (
    <Section className='relative w-full pt-10' id='experience'>
      <div className='flex flex-col gap-10'>
        <SectionHeader
          align='left'
          className='px-6'
          description='Where I have worked recently.'
          title='Experience'
        />

        <div>
          <div className='divide-y divide-dashed divide-border border-border border-t border-dashed'>
            {recent.map((experience, index) => (
              <ViewAnimation delay={0.05 * index} key={experience.id}>
                <ExperienceCard experience={experience} />
              </ViewAnimation>
            ))}
          </div>
          <SectionMoreLink
            delay={0.05 * recent.length}
            href='/about#experience'
          >
            View full timeline
          </SectionMoreLink>
        </div>
      </div>
    </Section>
  )
}

function ExperienceCard({ experience }: { experience: ExperienceItemType }) {
  const [position] = experience.positions
  if (!position) {
    return null
  }

  const { start, end } = position.employmentPeriod

  return (
    <article className='grid gap-4 px-6 py-8 sm:grid-cols-[auto_1fr_auto] sm:gap-6'>
      {experience.companyLogo ? (
        <Image
          alt=''
          className='size-11 shrink-0 rounded-lg border border-border bg-background object-contain p-1'
          height={44}
          src={experience.companyLogo}
          width={44}
        />
      ) : (
        <span className='size-11 shrink-0 rounded-lg bg-muted' />
      )}

      <div className='flex min-w-0 flex-col gap-3'>
        <div>
          <h3 className='flex items-center gap-2 font-medium text-lg'>
            {experience.companyWebsite ? (
              <PreviewLink
                className='transition-colors hover:text-muted-foreground'
                href={experience.companyWebsite}
              >
                {experience.companyName}
              </PreviewLink>
            ) : (
              experience.companyName
            )}
            {experience.isCurrentEmployer && <NowBadge />}
          </h3>
          <p className='text-muted-foreground'>{position.title}</p>
        </div>

        {position.description && (
          <p className='max-w-2xl text-pretty text-muted-foreground leading-relaxed'>
            <ReactMarkdown components={markdownComponents}>
              {position.description}
            </ReactMarkdown>
          </p>
        )}

        {position.skills && position.skills.length > 0 && (
          <ul className='flex flex-wrap gap-1.5'>
            {position.skills.map((skill) => (
              <li
                className='rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[0.7rem] text-muted-foreground'
                key={skill}
              >
                {skill}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className='font-mono text-muted-foreground text-xs tabular-nums sm:text-right'>
        {formatPeriod(start, end)}
        <span className='block opacity-70'>{formatDuration(start, end)}</span>
      </p>
    </article>
  )
}

function NowBadge() {
  return (
    <span className='inline-flex items-center gap-1.5 font-mono font-normal text-emerald-600 text-xs dark:text-emerald-400'>
      <span aria-hidden className='relative flex size-1.5'>
        <span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none' />
        <span className='relative inline-flex size-1.5 rounded-full bg-emerald-500' />
      </span>
      now
    </span>
  )
}
