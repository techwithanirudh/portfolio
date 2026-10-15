'use client'

// Adapted from chanhdai.com (MIT, (c) Chanh Dai): https://github.com/ncdai/chanhdai.com
import { format, parseISO } from 'date-fns'
import { Suspense, use, useEffect, useRef, useState } from 'react'
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
import { socials } from '@/constants/navigation'
import { cn } from '@/lib/utils'

interface ContributionsProps {
  contributions: Promise<Activity[]>
}

// Blue ramp instead of GitHub green so the graph sits in the site palette
const LEVELS = cn(
  'data-[level="0"]:fill-foreground/5',
  'data-[level="1"]:fill-primary/25',
  'data-[level="2"]:fill-primary/50',
  'data-[level="3"]:fill-primary/75',
  'data-[level="4"]:fill-primary'
)

const githubUrl = socials.find((social) => social.name === 'GitHub')?.url

interface HoveredDay {
  count: number
  date: string
  rect: SVGRectElement
}

// A year is ~370 blocks, so one tooltip follows the pointer instead of
// mounting a tooltip per block
const useDayTooltip = () => {
  const [day, setDay] = useState<HoveredDay | null>(null)
  const [open, setOpen] = useState(false)

  const onPointerOver = (event: React.PointerEvent) => {
    const rect = (event.target as Element).closest<SVGRectElement>(
      'rect[data-date]'
    )
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
  const ref = useRef<HTMLDivElement>(null)
  const tooltip = useDayTooltip()

  // Narrow screens scroll the year, start on the latest weeks
  useEffect(() => {
    const scroller = ref.current?.querySelector('.overflow-x-auto')
    if (scroller) {
      scroller.scrollLeft = scroller.scrollWidth
    }
  }, [])

  if (data.length === 0) {
    return null
  }

  const first = data[0]
  const last = data.at(-1)

  return (
    <Section>
      <h2 className='sr-only'>GitHub contributions</h2>
      <figure ref={ref}>
        <ContributionGraph
          aria-label='GitHub Contributions Graph'
          blockMargin={2}
          blockRadius={0}
          blockSize={11}
          className='w-full gap-3 py-4'
          data={data}
        >
          <ContributionGraphCalendar
            aria-hidden
            className='no-scrollbar px-4 font-mono text-[11px] **:data-[slot=month-labels]:text-muted-foreground md:[&>svg]:h-auto md:[&>svg]:w-full'
            title='GitHub Contributions'
            {...tooltip.handlers}
          >
            {({ activity, dayIndex, weekIndex }) => (
              <ContributionGraphBlock
                activity={activity}
                className={LEVELS}
                dayIndex={dayIndex}
                weekIndex={weekIndex}
              />
            )}
          </ContributionGraphCalendar>
          <Tooltip open={tooltip.open}>
            <TooltipContent anchor={tooltip.day?.rect}>
              {tooltip.day
                ? `${tooltip.day.count} contribution${tooltip.day.count === 1 ? '' : 's'} on ${format(parseISO(tooltip.day.date), 'd MMM yyyy')}`
                : null}
            </TooltipContent>
          </Tooltip>

          <ContributionGraphFooter className='flex-wrap gap-y-2 px-4 font-mono text-xs'>
            <ContributionGraphTotalCount>
              {({ totalCount }) => (
                <figcaption className='text-pretty text-muted-foreground tabular-nums'>
                  {totalCount.toLocaleString('en')} contributions
                  {first && last
                    ? `, ${format(parseISO(first.date), 'd MMM yyyy')} to ${format(parseISO(last.date), 'd MMM yyyy')}`
                    : ''}
                  {githubUrl ? (
                    <>
                      {' · '}
                      <a
                        className='underline-offset-4 transition-colors hover:text-foreground hover:underline'
                        href={githubUrl}
                        rel='noopener noreferrer'
                        target='_blank'
                      >
                        GitHub
                      </a>
                    </>
                  ) : null}
                </figcaption>
              )}
            </ContributionGraphTotalCount>
            <ContributionGraphLegend aria-hidden>
              {({ level }) => (
                <svg height={11} width={11}>
                  <rect
                    className={LEVELS}
                    data-level={level}
                    height={11}
                    width={11}
                  />
                </svg>
              )}
            </ContributionGraphLegend>
          </ContributionGraphFooter>
        </ContributionGraph>
      </figure>
    </Section>
  )
}

const Contributions = ({ contributions }: ContributionsProps) => (
  <Suspense fallback={<ContributionsFallback />}>
    <ContributionsGraph contributions={contributions} />
  </Suspense>
)

const ContributionsFallback = () => (
  <Section className='flex h-45 w-full items-center justify-center'>
    <Icons.spinner className='size-4 animate-spin text-muted-foreground' />
  </Section>
)

export default Contributions
