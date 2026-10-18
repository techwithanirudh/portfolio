'use client'

import { Suspense, use, useState } from 'react'

import {
  type Activity,
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from '@/components/features/contributions'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { Tooltip, TooltipContent } from '@/components/ui/tooltip'
import { ViewAnimation } from '@/components/view-animation'
import { baseOptions } from '@/constants/site'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

interface ContributionsProps {
  contributions: Promise<Activity[]>
}

const LEVELS = cn(
  'data-[level="0"]:fill-foreground/5',
  'data-[level="1"]:fill-primary/25',
  'data-[level="2"]:fill-primary/50',
  'data-[level="3"]:fill-primary/75',
  'data-[level="4"]:fill-primary'
)

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

const ContributionsGraph = ({ contributions }: ContributionsProps) => {
  const data = use(contributions)
  const isMobile = useIsMobile()
  const tooltip = useDayTooltip()
  const blockSize = isMobile ? 12 : 23.5

  if (data.length === 0) {
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

  return (
    <Section className='relative w-full p-6'>
      <ViewAnimation className='relative w-full'>
        <ContributionGraph
          aria-label='GitHub contributions graph'
          blockMargin={isMobile ? 3 : 2}
          blockSize={blockSize}
          className='w-full'
          data={data}
        >
          <ContributionGraphCalendar
            aria-hidden
            className='overflow-x-auto pb-2'
            title='GitHub contributions'
            {...tooltip.handlers}
          >
            {({ activity, dayIndex, weekIndex }) => (
              <ContributionGraphBlock
                activity={activity}
                className={cn(LEVELS, 'cursor-pointer')}
                dayIndex={dayIndex}
                weekIndex={weekIndex}
              />
            )}
          </ContributionGraphCalendar>
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
          <ContributionGraphFooter>
            <ContributionGraphTotalCount>
              {({ totalCount }) => (
                <div className='text-muted-foreground'>
                  {totalCount.toLocaleString('en')} contributions in the past
                  365 days.
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
                      className={LEVELS}
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
      </ViewAnimation>
    </Section>
  )
}

const Contributions = ({ contributions }: ContributionsProps) => (
  <Suspense fallback={<ContributionsFallback />}>
    <ContributionsGraph contributions={contributions} />
  </Suspense>
)

const ContributionsFallback = () => (
  <Section className='relative flex h-45 w-full items-center justify-center p-6'>
    <Icons.spinner className='size-4 animate-spin text-muted-foreground' />
  </Section>
)

export default Contributions
