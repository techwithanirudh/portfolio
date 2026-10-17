import Image from 'next/image'
import ReactMarkdown, { type Components } from 'react-markdown'
import { PreviewLink } from '@/components/preview-link'
import { ViewAnimation } from '@/components/view-animation'
import { formatDuration, formatPeriod } from '@/lib/employment-period'
import { cn } from '@/lib/utils'
import type { ExperienceItemType } from '@/types/experience'
import { ExperienceRail } from './experience-rail'

type TimelineVariant = 'preview' | 'full'

const markdownComponents: Components = {
  a: ({ children, href }) =>
    href ? (
      <PreviewLink className='link-underline' href={href}>
        {children}
      </PreviewLink>
    ) : (
      children
    ),
  p: ({ children }) => children,
}

// Mobile stacks the period above the body; from `sm` the period gets its own column left of the rail.
const rowClassName =
  'grid grid-cols-[40px_minmax(0,1fr)] gap-x-3.5 px-6 sm:grid-cols-[200px_64px_minmax(0,1fr)] sm:gap-x-0'

const startYear = (experience: ExperienceItemType) =>
  experience.positions[0]?.employmentPeriod.start.split('.').at(-1) ?? ''

/**
 * Experience as a vertical timeline: dates on the left, logo nodes on a dashed rail.
 * `preview` keeps each role to one line; `full` groups roles by start year, adds kind and skills,
 * and draws the rail in as you scroll.
 */
export function ExperienceTimeline({
  experiences,
  variant = 'preview',
}: {
  experiences: ExperienceItemType[]
  variant?: TimelineVariant
}) {
  let year: string | undefined
  let index = 0

  return (
    <div
      className={cn(
        // The rail runs through the node column's center: 24px gutter + 20px on mobile, 24px + 200px + 32px from `sm`.
        'relative border-border border-t border-dashed pt-3 pb-2 before:absolute before:inset-y-0 before:left-11 before:w-px before:-translate-x-1/2 before:border-muted-foreground/30 before:border-l before:border-dashed sm:before:left-64',
        variant === 'full' &&
          'pb-16 before:[mask-image:linear-gradient(to_bottom,#000_calc(100%-6rem),transparent)]'
      )}
    >
      {variant === 'full' && (
        // Stops short of the fade at the bottom, along the same rail
        <ExperienceRail className='top-0 bottom-16 left-11 sm:left-64' />
      )}
      {experiences.flatMap((experience) => {
        const items: React.ReactNode[] = []
        const experienceYear = startYear(experience)

        if (variant === 'full' && experienceYear !== year) {
          year = experienceYear
          items.push(
            <ViewAnimation
              className={cn(rowClassName, 'items-center pt-4.5')}
              delay={0.05 * index++}
              key={`year-${experienceYear}`}
            >
              <p className='col-start-2 row-start-1 font-mono text-[12.5px] text-foreground tracking-wide sm:col-start-1'>
                {experienceYear}
              </p>
              <span className='col-start-1 row-start-1 size-[9px] justify-self-center rounded-full border border-muted-foreground bg-background sm:col-start-2' />
            </ViewAnimation>
          )
        }

        items.push(
          <ViewAnimation delay={0.05 * index++} key={experience.id}>
            <TimelineRow experience={experience} variant={variant} />
          </ViewAnimation>
        )

        return items
      })}
    </div>
  )
}

function TimelineRow({
  experience,
  variant,
}: {
  experience: ExperienceItemType
  variant: TimelineVariant
}) {
  const [position] = experience.positions
  if (!position) {
    return null
  }

  const { start, end } = position.employmentPeriod

  return (
    <article className={cn(rowClassName, 'py-5.5 sm:py-6')}>
      <p className='col-start-2 row-start-1 mb-2 font-mono text-muted-foreground text-xs tabular-nums leading-normal sm:col-start-1 sm:mb-0 sm:pt-3'>
        {formatPeriod(start, end)}
        <span className='ml-2 opacity-70 sm:ml-0 sm:block'>
          {formatDuration(start, end)}
        </span>
      </p>

      <div
        className={cn(
          'relative col-start-1 row-span-2 row-start-1 flex size-10 items-center justify-center justify-self-center rounded-full border border-muted-foreground/30 bg-background sm:col-start-2 sm:row-span-1 sm:size-11',
          experience.isCurrentEmployer &&
            'border-2 border-primary ring-6 ring-primary/12'
        )}
      >
        {experience.companyLogo ? (
          <Image
            alt=''
            className='size-6 object-contain'
            height={24}
            src={experience.companyLogo}
            width={24}
          />
        ) : (
          <span className='size-6 rounded-full bg-muted' />
        )}
        {experience.isCurrentEmployer && (
          <NowBadge className='absolute -top-0.5 -right-0.5' />
        )}
      </div>

      <div className='col-start-2 row-start-2 min-w-0 sm:col-start-3 sm:row-start-1 sm:pt-2'>
        <h3 className='font-medium text-[17px] tracking-tight'>
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
        </h3>
        <p className='mt-0.5 text-muted-foreground'>
          {position.title}
          {variant === 'full' && (
            // Narrow columns wrap the kind anyway, so it takes its own line there instead of leading with a stray dot.
            <span className='block font-mono text-[13px] md:inline'>
              <span className='hidden md:inline'> · </span>
              {position.employmentType ?? 'Research'}
            </span>
          )}
        </p>

        {position.description && (
          <p
            className={cn(
              'mt-2 max-w-[60ch] text-pretty text-muted-foreground leading-relaxed',
              variant === 'preview' && 'line-clamp-2 sm:line-clamp-1'
            )}
          >
            <ReactMarkdown components={markdownComponents}>
              {position.description}
            </ReactMarkdown>
          </p>
        )}

        {variant === 'full' &&
          position.skills &&
          position.skills.length > 0 && (
            <ul className='mt-3 flex flex-wrap gap-1.5'>
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
    </article>
  )
}

function NowBadge({ className }: { className?: string }) {
  return (
    <span
      aria-label='Current role'
      className={cn('flex size-3 items-center justify-center', className)}
      role='img'
    >
      <span className='absolute inline-flex size-3 animate-ping rounded-full bg-primary opacity-40 motion-reduce:animate-none' />
      <span className='relative inline-flex size-2 rounded-full bg-primary' />
    </span>
  )
}
