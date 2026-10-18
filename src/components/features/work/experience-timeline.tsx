import Image from 'next/image'
import ReactMarkdown, { type Components } from 'react-markdown'
import { PreviewLink } from '@/components/preview-link'
import { staggerDelay, ViewAnimation } from '@/components/view-animation'
import { formatDuration, formatPeriod } from '@/lib/employment-period'
import { cn } from '@/lib/utils'
import type { ExperienceItemType } from '@/types/experience'
import { ExperienceRail, RailNode } from './experience-rail'

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

const rowClassName =
  'grid grid-cols-[40px_minmax(0,1fr)] gap-x-3.5 px-6 wide:grid-cols-[200px_64px_minmax(0,1fr)] wide:gap-x-0'

// TODO(slopradar): duplicate-logic: splits the MM.yyyy / yyyy period format by hand, which lib/employment-period.ts owns (parsePeriodDate); export a periodYear(value) there and use it
const startYear = (experience: ExperienceItemType) =>
  experience.positions[0]?.employmentPeriod.start.split('.').at(-1) ?? ''

type TimelineEntry =
  | { experience: ExperienceItemType; kind: 'role' }
  | { kind: 'year'; year: string }

const toEntries = (
  experiences: ExperienceItemType[],
  variant: TimelineVariant
): TimelineEntry[] => {
  const withYears = variant === 'full'
  const entries: TimelineEntry[] = []
  let year: string | undefined
  for (const experience of experiences) {
    const experienceYear = startYear(experience)
    if (withYears && experienceYear !== year) {
      year = experienceYear
      entries.push({ kind: 'year', year: experienceYear })
    }
    entries.push({ experience, kind: 'role' })
  }
  return entries
}

export function ExperienceTimeline({
  className,
  experiences,
  variant = 'preview',
}: {
  className?: string
  experiences: ExperienceItemType[]
  variant?: TimelineVariant
}) {
  return (
    <div
      className={cn(
        // The rail runs through the node column's center: 24px gutter + 20px on mobile, 24px + 200px + 32px from `wide`.
        'relative border-border border-t border-dashed pt-3 pb-2 before:absolute before:inset-y-0 before:left-11 wide:before:left-64 before:w-px before:-translate-x-1/2 before:border-muted-foreground/30 before:border-l before:border-dashed',
        variant === 'full' &&
          'pb-16 before:[mask-image:linear-gradient(to_bottom,#000_calc(100%-6rem),transparent)]',
        className
      )}
    >
      {variant === 'full' && (
        <ExperienceRail className='left-11 wide:left-64' />
      )}
      {toEntries(experiences, variant).map((entry, index) =>
        entry.kind === 'year' ? (
          <ViewAnimation
            className={cn(rowClassName, 'items-center pt-4.5')}
            delay={staggerDelay(index)}
            key={`year-${entry.year}`}
          >
            <p className='col-start-2 wide:col-start-1 row-start-1 font-mono text-[12.5px] text-foreground tracking-wide'>
              {entry.year}
            </p>
            <RailNode className='col-start-1 wide:col-start-2 row-start-1 size-[9px] justify-self-center rounded-full border border-muted-foreground bg-background data-passed:border-primary data-passed:bg-primary' />
          </ViewAnimation>
        ) : (
          <ViewAnimation delay={staggerDelay(index)} key={entry.experience.id}>
            <TimelineRow experience={entry.experience} variant={variant} />
          </ViewAnimation>
        )
      )}
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
  const NodeComponent = variant === 'full' ? RailNode : 'div'

  return (
    <article className={cn(rowClassName, 'py-5.5 wide:py-6')}>
      <p className='col-start-2 wide:col-start-1 row-start-1 mb-2 wide:mb-0 wide:pt-3 font-mono text-muted-foreground text-xs tabular-nums leading-normal'>
        {formatPeriod(start, end)}
        <span className='ml-2 wide:ml-0 wide:block'>
          {formatDuration(start, end)}
        </span>
      </p>

      <NodeComponent
        className={cn(
          'relative col-start-1 wide:col-start-2 row-start-2 wide:row-start-1 -mt-[7px] wide:mt-0 flex size-10 wide:size-11 items-center justify-center justify-self-center rounded-full border border-muted-foreground/30 bg-background data-passed:border-primary',
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
      </NodeComponent>

      <div className='col-start-2 wide:col-start-3 row-start-2 wide:row-start-1 min-w-0 wide:pt-2'>
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
            <span className='block font-mono text-[13px] md:inline'>
              <span className='hidden md:inline'> · </span>
              {/* TODO(slopradar): fallback-shaping: a missing employmentType silently renders as 'Research', make it required in types/experience or omit the label */}
              {position.employmentType ?? 'Research'}
            </span>
          )}
        </p>

        {position.description && (
          <p
            className={cn(
              'mt-2 max-w-[60ch] text-pretty text-muted-foreground leading-relaxed',
              variant === 'preview' && 'wide:line-clamp-1'
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
