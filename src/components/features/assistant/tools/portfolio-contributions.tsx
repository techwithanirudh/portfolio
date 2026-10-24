import { getDay, parseISO } from 'date-fns'
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
import { baseOptions } from '@/constants/site'
import { cn } from '@/lib/utils'

// Whole weeks back from the last day, so the first column is never partial
const lastWeeks = (data: Activity[], weeks: number) => {
  const last = data.at(-1)
  if (!last) {
    return data
  }
  return data.slice(-(7 * (weeks - 1) + getDay(parseISO(last.date)) + 1))
}

interface GraphProps {
  blockMargin: number
  blockSize: number
  className: string
  data: Activity[]
  totalCount: number
}

const Graph = ({
  blockMargin,
  blockSize,
  className,
  data,
  totalCount,
}: GraphProps) => (
  <ContributionGraph
    aria-label='GitHub contributions graph'
    blockMargin={blockMargin}
    blockSize={blockSize}
    className={cn('w-full', className)}
    data={data}
    fontSize={12}
    role='figure'
    totalCount={totalCount}
  >
    <ContributionGraphCalendar aria-hidden title='GitHub contributions'>
      {({ activity, dayIndex, weekIndex }) => (
        <ContributionGraphBlock
          activity={activity}
          className={contributionLevels}
          dayIndex={dayIndex}
          weekIndex={weekIndex}
        >
          <title>
            {`${activity.date}: ${activity.count} ${activity.count === 1 ? 'contribution' : 'contributions'}`}
          </title>
        </ContributionGraphBlock>
      )}
    </ContributionGraphCalendar>
    <ContributionGraphFooter>
      <ContributionGraphTotalCount>
        {({ totalCount: count }) => (
          <div className='text-muted-foreground'>
            {count.toLocaleString('en')} contributions in the past 365 days.
          </div>
        )}
      </ContributionGraphTotalCount>
      <ContributionGraphLegend aria-hidden>
        {({ level }) => (
          <svg className='size-2.5' viewBox='0 0 12 12'>
            <rect
              className={contributionLevels}
              data-level={level}
              height={12}
              rx={2}
              width={12}
            />
          </svg>
        )}
      </ContributionGraphLegend>
    </ContributionGraphFooter>
  </ContributionGraph>
)

export const ContributionsCard = ({ data }: { data: Activity[] }) => {
  if (data.length === 0) {
    return (
      <p className='px-3 wide:px-4 py-2.5 text-muted-foreground text-sm'>
        The contribution graph is unavailable right now.{' '}
        <a className='link-underline' href={baseOptions.githubUrl}>
          See it on GitHub
        </a>
        .
      </p>
    )
  }

  const totalCount = data.reduce((sum, day) => sum + day.count, 0)
  return (
    <div className='px-3 wide:px-4 py-3 wide:py-4'>
      <Graph
        blockMargin={3}
        blockSize={11}
        className='wide:hidden'
        data={lastWeeks(data, 20)}
        totalCount={totalCount}
      />
      <Graph
        blockMargin={2}
        blockSize={10}
        className='wide:flex hidden'
        data={data}
        totalCount={totalCount}
      />
    </div>
  )
}
