// Adapted from chanhdai.com/src/features/portfolio/components/experiences/experience-position-item.tsx (MIT, © 2026 Chánh Đại). See ../NOTICES.md
import { differenceInMonths, parse } from 'date-fns'
import { BriefcaseBusinessIcon } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import type { ExperiencePositionItemType } from '@/types/experience'
import { IconTile } from './icon-tile'
import { InlineMarkdown } from './inline-markdown'
import { Tag } from './tag'
import { ToggleGlyph } from './toggle-glyph'

/** `MM.YYYY` to `YYYY-MM`; `YYYY` stays as it is. */
const isoPeriod = (period: string) => {
  const [a, b] = period.split('.')
  return b ? `${b}-${a}` : period
}

export function ExperiencePositionItem({
  position,
}: {
  position: ExperiencePositionItemType
}) {
  const { start, end } = position.employmentPeriod
  const isOngoing = !end
  const duration = formatDuration(start, end)

  return (
    <Collapsible
      className='group/experience-position relative'
      defaultOpen={position.isExpanded}
      disabled={!position.description}
    >
      {/* Elbow that closes the rail on the last position. */}
      <div className='pointer-events-none absolute bottom-0 left-3 hidden size-4 bg-(--sheet) group-last/experience-position:flex'>
        <span className='size-full -translate-y-2.25 border-(--line-strong) border-b border-l' />
      </div>

      <CollapsibleTrigger
        className={cn(
          'group/toggle block w-full text-left',
          'relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:-z-1 before:rounded-[3px] before:transition-[background-color] before:ease-out hover:before:bg-(--hover)',
          'outline-none focus-visible:before:outline focus-visible:before:outline-(--accent)',
          'data-disabled:before:content-none'
        )}
      >
        <span className='relative z-1 mb-1 flex items-start gap-3 text-base'>
          <IconTile>{position.icon ?? <BriefcaseBusinessIcon />}</IconTile>
          <span className='flex-1 text-balance font-medium'>
            {position.title}
          </span>
          <ToggleGlyph className='mt-1 group-data-disabled/toggle:hidden' />
        </span>

        <span className='flex flex-wrap items-center gap-x-2 gap-y-0.5 pl-9 font-mono text-(--ink-muted) text-[12px] tabular-nums'>
          {position.employmentType && (
            <>
              <span className='uppercase tracking-[0.06em]'>
                {position.employmentType}
              </span>
              <span aria-hidden className='h-3 w-px bg-(--line)' />
            </>
          )}
          <span>
            {isoPeriod(start)}
            <span aria-hidden className='px-1'>
              →
            </span>
            {isOngoing ? (
              <span className='text-(--redline)'>present</span>
            ) : (
              isoPeriod(end)
            )}
          </span>
          {duration && (
            <>
              <span aria-hidden className='h-3 w-px bg-(--line)' />
              <span>{duration}</span>
            </>
          )}
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent className='ds-collapsible'>
        {position.description && (
          <p className='max-w-[64ch] pt-3 pb-1 pl-9 text-(--ink-muted) text-[15px] leading-relaxed'>
            <InlineMarkdown>{position.description}</InlineMarkdown>
          </p>
        )}
      </CollapsibleContent>

      {Array.isArray(position.skills) && position.skills.length > 0 && (
        <ul className='flex flex-wrap gap-1.5 pt-3 pl-9'>
          {position.skills.map((skill) => (
            <li className='flex' key={skill}>
              <Tag>{skill}</Tag>
            </li>
          ))}
        </ul>
      )}
    </Collapsible>
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
