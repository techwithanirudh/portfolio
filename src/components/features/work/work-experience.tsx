import Image from 'next/image'
import type { ComponentProps } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import {
  ExperiencePositionChevron,
  ExperiencePositionCollapsible,
} from '@/components/features/work/experience-position-collapsible'
import { Icons } from '@/components/icons/icons'
import { PreviewLink } from '@/components/preview-link'
import { Prose } from '@/components/prose'
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { ViewAnimation } from '@/components/view-animation'
import { formatDuration } from '@/lib/employment-period'
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

const markdownComponents: Components = {
  a: ({ children, href }) =>
    href ? <PreviewLink href={href}>{children}</PreviewLink> : children,
}

export function WorkExperience({
  className,
  experiences,
}: WorkExperienceProps) {
  return (
    <div className={cn('divide-y divide-line', className)}>
      {experiences.map((experience, index) => (
        <ViewAnimation delay={0.05 * index} key={experience.id}>
          <ExperienceItem experience={experience} />
        </ViewAnimation>
      ))}
    </div>
  )
}

function ExperienceItem({ experience }: ExperienceItemProps) {
  return (
    <div className='group/exp space-y-4 p-4'>
      <div className='not-prose flex items-center gap-3'>
        <div className='flex size-6 shrink-0 items-center justify-center'>
          {experience.companyLogo ? (
            <Image
              alt={experience.companyName}
              className='size-6 transition-transform duration-300 ease-out group-hover/exp:-rotate-6 group-hover/exp:scale-110 motion-reduce:transition-none'
              height={24}
              src={experience.companyLogo}
              width={24}
            />
          ) : (
            <Icons.code className='size-4 text-muted-foreground' />
          )}
        </div>

        <h3 className='font-semibold text-lg leading-snug'>
          {experience.companyWebsite ? (
            <PreviewLink className='link' href={experience.companyWebsite}>
              {experience.companyName}
            </PreviewLink>
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

function ExperiencePositionItem({ position }: ExperiencePositionItemProps) {
  const { start, end } = position.employmentPeriod
  const isOngoing = !end
  const duration = formatDuration(start, end)

  return (
    <ExperiencePositionCollapsible
      defaultOpen={position.isExpanded}
      disabled={!position.description}
    >
      {/* The heading wraps the trigger since buttons only take phrasing content */}
      <h4 className='not-prose'>
        <CollapsibleTrigger
          className={cn(
            'group/experience-position not-prose block w-full select-none text-left focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2 focus-visible:outline-offset-2',
            'relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 hover:before:bg-card',
            'data-disabled:before:content-none'
          )}
        >
          <span className='relative z-1 mb-1 flex items-center gap-3'>
            <span
              className={cn(
                'flex size-6 shrink-0 items-center justify-center',
                'bg-muted text-muted-foreground',
                'border border-line',
                "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0"
              )}
            >
              {position.icon ?? <Icons.experience />}
            </span>

            <span className='flex-1 text-balance font-medium text-base text-foreground'>
              {position.title}
            </span>

            <span className='shrink-0 text-muted-foreground group-disabled/experience-position:hidden [&_svg]:size-4'>
              <ExperiencePositionChevron />
            </span>
          </span>

          <span className='relative z-1 flex items-center gap-2 pl-9 text-muted-foreground text-sm'>
            {position.employmentType && (
              <>
                <span>
                  <span className='sr-only'>Employment Type: </span>
                  {position.employmentType}
                </span>

                <Separator
                  className='data-vertical:h-4 data-vertical:self-center'
                  orientation='vertical'
                  render={<span />}
                />
              </>
            )}

            <span className='flex items-center gap-0.5 tabular-nums'>
              <span className='sr-only'>Employment Period: </span>
              <span>{start}</span>
              <span className='font-mono'>—</span>
              {isOngoing ? (
                <Icons.infinity
                  aria-label='Present'
                  className='size-4.5 translate-y-[0.5px]'
                />
              ) : (
                <span>{end}</span>
              )}
            </span>

            {duration && (
              <>
                <Separator
                  className='data-vertical:h-4 data-vertical:self-center'
                  orientation='vertical'
                  render={<span />}
                />
                <span className='tabular-nums'>
                  <span className='sr-only'>Duration: </span>
                  {duration}
                </span>
              </>
            )}
          </span>
        </CollapsibleTrigger>
      </h4>

      <CollapsibleContent className='overflow-hidden'>
        {position.description && (
          <Prose className='pt-2 pl-9'>
            <ReactMarkdown components={markdownComponents}>
              {position.description}
            </ReactMarkdown>
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
    </ExperiencePositionCollapsible>
  )
}

function Skill({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center border border-line bg-muted/50 px-1.5 py-0.5 font-mono text-muted-foreground text-xs',
        className
      )}
      {...props}
    />
  )
}
