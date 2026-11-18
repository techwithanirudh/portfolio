'use client'

import { useState } from 'react'
import { contributionLevels } from '@/components/features/contribution-levels'
import {
  type Activity,
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from '@/components/features/contributions'
import { Section } from '@/components/layout/sections'
import { Tooltip, TooltipContent } from '@/components/ui/tooltip'
import { ViewAnimation } from '@/components/view-animation'
import { baseOptions } from '@/constants/site'
import { cn } from '@/lib/utils'

interface ContributionsProps {
  contributions: Activity[]
}

interface HoveredDay {
  count: number
  date: string
  rect: SVGRectElement
}

const useDayTooltip = () => {
  const [day, setDay] = useState<HoveredDay | null>(null)
  const [open, setOpen] = useState(false)

  const onPointerOver = (event: React.PointerEvent) => {
    const rect =
      event.target instanceof Element
        ? event.target.closest<SVGRectElement>('rect[data-date]')
        : null
    if (!rect?.dataset.date) {
      return
    }
    setDay({
      count: Number(rect.dataset.count),
      date: rect.dataset.date,
      rect,
    })
    setOpen(true)
  }

  return {
    day,
    handlers: { onPointerLeave: () => setOpen(false), onPointerOver },
    open,
  }
}

interface GraphProps {
  blockMargin: number
  blockSize: number
  className: string
  data: Activity[]
  onPointerLeave: () => void
  onPointerOver: (event: React.PointerEvent) => void
}

const Graph = ({
  blockMargin,
  blockSize,
  className,
  data,
  ...handlers
}: GraphProps) => (
  <ContributionGraph
    aria-label='GitHub contributions graph'
    blockMargin={blockMargin}
    blockSize={blockSize}
    className={cn('w-full', className)}
    data={data}
    role='figure'
  >
    <ContributionGraphCalendar
      aria-hidden
      className='overflow-x-auto pb-2'
      title='GitHub contributions'
      {...handlers}
    >
      {({ activity, dayIndex, weekIndex }) => (
        <ContributionGraphBlock
          activity={activity}
          className={cn(contributionLevels, 'cursor-pointer')}
          dayIndex={dayIndex}
          weekIndex={weekIndex}
        />
      )}
    </ContributionGraphCalendar>
    <ContributionGraphFooter>
      <ContributionGraphTotalCount>
        {({ totalCount }) => (
          <div className='text-muted-foreground'>
            {totalCount.toLocaleString('en')} contributions in the past 365
            days.
          </div>
        )}
      </ContributionGraphTotalCount>
      <ContributionGraphLegend>
        {({ level }) => (
          <div
            className='group relative flex size-3 items-center justify-center'
            data-level={level}
          >
            <svg aria-hidden className='size-full' viewBox='0 0 12 12'>
              <rect
                className={contributionLevels}
                data-level={level}
                height={12}
                rx={2}
                width={12}
              />
            </svg>
            <span className='sr-only'>Level {level}</span>
            <span
              aria-hidden
              className='absolute -top-8 hidden rounded bg-popover px-2 py-1 text-popover-foreground text-xs shadow-md group-hover:block'
            >
              Level {level}
            </span>
          </div>
        )}
      </ContributionGraphLegend>
    </ContributionGraphFooter>
  </ContributionGraph>
)

const Contributions = ({ contributions }: ContributionsProps) => {
  const tooltip = useDayTooltip()

  if (contributions.length === 0) {
    return (
      <Section className='p-6 text-muted-foreground text-sm'>
        The contribution graph is unavailable right now.{' '}
        <a className='link-underline' href={baseOptions.githubUrl}>
          See it on GitHub
        </a>
        .
      </Section>
    )
  }

  // Both block sizes render and CSS shows one, so the server HTML already has
  // the right size on phones instead of switching after hydration
  return (
    <Section className='relative w-full p-6'>
      <ViewAnimation className='relative w-full'>
        <Graph
          blockMargin={3}
          blockSize={12}
          className='md:hidden'
          data={contributions}
          {...tooltip.handlers}
        />
        <Graph
          blockMargin={2}
          blockSize={23.5}
          className='hidden md:flex'
          data={contributions}
          {...tooltip.handlers}
        />
        <Tooltip open={tooltip.open}>
          <TooltipContent
            anchor={tooltip.day?.rect}
            className='pointer-events-none'
          >
            {tooltip.day ? (
              <>
                <p className='font-semibold'>{tooltip.day.date}</p>
                <p>
                  <span className='tabular-nums'>{tooltip.day.count}</span>{' '}
                  {tooltip.day.count === 1 ? 'contribution' : 'contributions'}
                </p>
              </>
            ) : null}
          </TooltipContent>
        </Tooltip>
      </ViewAnimation>
    </Section>
  )
}

export default Contributions
