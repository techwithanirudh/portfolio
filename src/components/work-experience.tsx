'use client'

import { Briefcase01Icon, Infinity01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { differenceInMonths, parse } from 'date-fns'
import Image from 'next/image'
import { type ComponentProps, useCallback, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import type { ChevronsUpDownIconHandle } from '@/components/chevrons-up-down-icon'
import { ChevronsUpDownIcon } from '@/components/chevrons-up-down-icon'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'
import type {
  ExperienceItemProps,
  ExperiencePositionItemProps,
  WorkExperienceProps,
} from '@/types/experience'

export type {
  ExperienceItemProps,
  ExperienceItemType,
  ExperiencePositionItemProps,
  ExperiencePositionItemType,
  WorkExperienceProps,
} from '@/types/experience'

export function WorkExperience({
  className,
  experiences,
}: WorkExperienceProps) {
  return (
    <div className={cn('divide-y divide-dashed divide-border', className)}>
      {experiences.map((experience, index) => (
        <ViewAnimation
          delay={0.05 * index}
          initial={{ opacity: 0, translateY: -6 }}
          key={experience.id}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <ExperienceItem experience={experience} />
        </ViewAnimation>
      ))}
    </div>
  )
}

export function ExperienceItem({ experience }: ExperienceItemProps) {
  return (
    <div className='space-y-4 p-4'>
      <div className='not-prose flex items-center gap-3'>
        <div className='flex size-6 shrink-0 items-center justify-center'>
          {experience.companyLogo ? (
            <Image
              alt={experience.companyName}
              className='size-6 rounded'
              height={24}
              src={experience.companyLogo}
              width={24}
            />
          ) : (
            <span className='flex size-3 border bg-muted' />
          )}
        </div>

        <h3 className='font-semibold text-lg leading-snug'>
          {experience.companyWebsite ? (
            <a
              className='link'
              href={experience.companyWebsite}
              rel='noopener noreferrer'
              target='_blank'
            >
              {experience.companyName}
            </a>
          ) : (
            experience.companyName
          )}
        </h3>

        {experience.isCurrentEmployer && (
          <span
            aria-label='Current Employer'
            className='relative flex items-center justify-center'
            role='img'
          >
            <span className='absolute inline-flex size-3 animate-ping rounded-full bg-primary opacity-40' />
            <span className='relative inline-flex size-2 rounded-full bg-primary' />
          </span>
        )}
      </div>

      <div className='relative space-y-4 before:absolute before:left-3 before:h-full before:w-px before:bg-border'>
        {experience.positions.map((position) => (
          <ExperiencePositionItem key={position.id} position={position} />
        ))}
      </div>
    </div>
  )
}

export function ExperiencePositionItem({
  position,
}: ExperiencePositionItemProps) {
  const chevronsIconRef = useRef<ChevronsUpDownIconHandle>(null)

  const handleOpenChange = useCallback((open: boolean) => {
    const controls = chevronsIconRef.current
    if (!controls) {
      return
    }

    if (open) {
      controls.startAnimation()
    } else {
      controls.stopAnimation()
    }
  }, [])

  const { start, end } = position.employmentPeriod
  const isOngoing = !end
  const duration = formatDuration(start, end)

  return (
    <Collapsible
      asChild
      defaultOpen={position.isExpanded}
      disabled={!position.description}
      onOpenChange={handleOpenChange}
    >
      <div className='relative last:before:absolute last:before:h-full last:before:w-4 last:before:bg-background'>
        <CollapsibleTrigger
          className={cn(
            'group/experience-position not-prose block w-full select-none text-left',
            'relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:rounded hover:before:bg-muted/40',
            'data-disabled:before:content-none'
          )}
        >
          <div className='relative z-1 mb-1 flex items-center gap-3'>
            <div
              className={cn(
                'flex size-6 shrink-0 items-center justify-center',
                'bg-muted text-muted-foreground',
                'border border-border',
                "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0"
              )}
            >
              {position.icon ?? (
                <HugeiconsIcon icon={Briefcase01Icon} strokeWidth={2} />
              )}
            </div>

            <h4 className='flex-1 text-balance font-medium text-base text-foreground'>
              {position.title}
            </h4>

            <div className='shrink-0 text-muted-foreground group-disabled/experience-position:hidden [&_svg]:size-4'>
              <ChevronsUpDownIcon duration={0.15} ref={chevronsIconRef} />
            </div>
          </div>

          <div className='relative z-1 flex items-center gap-2 pl-9 text-muted-foreground text-sm'>
            {position.employmentType && (
              <>
                <dl>
                  <dt className='sr-only'>Employment Type</dt>
                  <dd>{position.employmentType}</dd>
                </dl>

                <Separator
                  className='data-vertical:h-4 data-vertical:self-center'
                  orientation='vertical'
                />
              </>
            )}

            <dl>
              <dt className='sr-only'>Employment Period</dt>
              <dd className='flex items-center gap-0.5 tabular-nums'>
                <span>{start}</span>
                <span className='font-mono'>—</span>
                {isOngoing ? (
                  <HugeiconsIcon
                    aria-label='Present'
                    className='size-4.5 translate-y-[0.5px]'
                    icon={Infinity01Icon}
                    strokeWidth={2}
                  />
                ) : (
                  <span>{end}</span>
                )}
              </dd>
            </dl>

            {duration && (
              <>
                <Separator
                  className='data-vertical:h-4 data-vertical:self-center'
                  orientation='vertical'
                />
                <dl>
                  <dt className='sr-only'>Duration</dt>
                  <dd className='tabular-nums'>{duration}</dd>
                </dl>
              </>
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className='overflow-hidden'>
          {position.description && (
            <Prose className='pt-2 pl-9'>
              <ReactMarkdown>{position.description}</ReactMarkdown>
            </Prose>
          )}
        </CollapsibleContent>

        {Array.isArray(position.skills) && position.skills.length > 0 && (
          <ul className='not-prose flex flex-wrap gap-1.5 pt-3 pl-9'>
            {position.skills.map((skill) => (
              <li className='flex' key={skill}>
                <Skill>{skill}</Skill>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Collapsible>
  )
}

function Prose({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'prose prose-content prose-zinc dark:prose-invert max-w-none',
        className
      )}
      {...props}
    />
  )
}

function Skill({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center border border-border border-dashed bg-muted/50 px-1.5 py-0.5 font-mono text-muted-foreground text-xs',
        className
      )}
      {...props}
    />
  )
}

function formatDuration(start: string, end?: string): string {
  const startHasMonth = start.includes('.')
  const endHasMonth = end ? end.includes('.') : true

  // Both year-only: granularity is years, no month arithmetic needed.
  if (!startHasMonth && end && !endHasMonth) {
    const years = Number.parseInt(end, 10) - Number.parseInt(start, 10)
    if (years <= 0) {
      return ''
    }
    return `${years}y`
  }

  const startDate = parsePeriodDate(start, 'first')
  const endDate = end ? parsePeriodDate(end, 'last') : new Date()

  // +1 to count both the start and end months inclusively.
  const totalMonths = differenceInMonths(endDate, startDate) + 1
  if (totalMonths <= 0) {
    return ''
  }

  if (totalMonths < 12) {
    return `${totalMonths}m`
  }

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  if (months === 0) {
    return `${years}y`
  }
  return `${years}y ${months}m`
}

function parsePeriodDate(str: string, fallbackMonth: 'first' | 'last'): Date {
  if (str.includes('.')) {
    return parse(str, 'MM.yyyy', new Date())
  }
  return parse(
    `${fallbackMonth === 'last' ? '12' : '01'}.${str}`,
    'MM.yyyy',
    new Date()
  )
}
