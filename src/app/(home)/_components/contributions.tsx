'use client'

import { Suspense, use } from 'react'

import {
  type Activity,
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from '@/components/features/contributions/contribution-graph'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections/section'
import { ViewAnimation } from '@/components/shared/view-animation'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

interface ContributionsProps {
  contributions: Promise<Activity[]>
}

const ContributionsGraph = ({ contributions }: ContributionsProps) => {
  const data = use(contributions)
  const isMobile = useIsMobile()
  const blockSize = isMobile ? 10 : 23.5

  return (
    <Section className='relative w-full p-6'>
      <ViewAnimation
        className='relative w-full'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <ContributionGraph
          aria-label='GitHub Contributions Graph'
          blockMargin={isMobile ? 1 : 2}
          blockSize={blockSize}
          className='w-full'
          data={data}
        >
          <ContributionGraphCalendar
            aria-hidden
            className='overflow-auto'
            title='GitHub Contributions'
          >
            {({ activity, dayIndex, weekIndex }) => (
              <Tooltip>
                <TooltipTrigger asChild>
                  <g>
                    <ContributionGraphBlock
                      activity={activity}
                      className={cn(
                        'data-[level="1"]:fill-[#9be9a8] dark:data-[level="1"]:fill-[#0e4429]',
                        'data-[level="2"]:fill-[#40c463] dark:data-[level="2"]:fill-[#006d32]',
                        'data-[level="3"]:fill-[#30a14e] dark:data-[level="3"]:fill-[#26a641]',
                        'data-[level="4"]:fill-[#216e39] dark:data-[level="4"]:fill-[#39d353]',
                        'cursor-pointer'
                      )}
                      dayIndex={dayIndex}
                      weekIndex={weekIndex}
                    />
                  </g>
                </TooltipTrigger>
                <TooltipContent>
                  <p className='font-semibold'>{activity.date}</p>
                  <p>
                    <span className='tabular-nums'>{activity.count}</span>{' '}
                    {activity.count === 1 ? 'contribution' : 'contributions'}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </ContributionGraphCalendar>
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
                  className='group relative flex h-3 w-3 items-center justify-center'
                  data-level={level}
                >
                  <div
                    className={cn(
                      'h-full w-full rounded-xs border border-border',
                      level === 0 && 'bg-[#eeeeee] dark:bg-[#262626]',
                      level === 1 && 'bg-[#9be9a8] dark:bg-[#0e4429]',
                      level === 2 && 'bg-[#40c463] dark:bg-[#006d32]',
                      level === 3 && 'bg-[#30a14e] dark:bg-[#26a641]',
                      level === 4 && 'bg-[#216e39] dark:bg-[#39d353]'
                    )}
                  />
                  <span className='absolute -top-8 hidden rounded bg-popover px-2 py-1 text-popover-foreground text-xs shadow-md group-hover:block'>
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

export const ContributionsFallback = () => (
  <Section className='relative flex h-45 w-full items-center justify-center p-6'>
    <Icons.spinner className='size-4 animate-spin text-muted-foreground' />
  </Section>
)

export default Contributions
