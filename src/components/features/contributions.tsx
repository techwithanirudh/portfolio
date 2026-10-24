'use client'

// Adapted from the Kibo UI contribution-graph component (MIT):
// https://www.kibo-ui.com/components/contribution-graph
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  formatISO,
  getDay,
  getMonth,
  nextDay,
  parseISO,
  subWeeks,
} from 'date-fns'
import {
  type CSSProperties,
  createContext,
  Fragment,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useMemo,
} from 'react'
import { contributionLevels } from '@/components/features/contribution-levels'
import { cn } from '@/lib/utils'

export interface Activity {
  count: number
  date: string
  level: number
}

interface Week extends Array<Activity | undefined> {}

interface MonthLabel {
  label: string
  weekIndex: number
}

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const MAX_LEVEL = 4

interface ContributionGraphContextType {
  blockMargin: number
  blockRadius: number
  blockSize: number
  data: Activity[]
  fontSize: number
  height: number
  labelHeight: number
  totalCount: number
  weeks: Week[]
  width: number
}

const ContributionGraphContext =
  createContext<ContributionGraphContextType | null>(null)

const useContributionGraph = () => {
  const context = useContext(ContributionGraphContext)

  if (!context) {
    throw new Error(
      'ContributionGraph components must be used within a ContributionGraph'
    )
  }

  return context
}

const fillHoles = (activities: Activity[]): Activity[] => {
  if (activities.length === 0) {
    return []
  }

  const sortedActivities = [...activities].sort((a, b) =>
    a.date.localeCompare(b.date)
  )

  const calendar = new Map<string, Activity>(activities.map((a) => [a.date, a]))

  const firstActivity = sortedActivities[0] as Activity
  const lastActivity = sortedActivities.at(-1)

  if (!lastActivity) {
    return []
  }

  return eachDayOfInterval({
    end: parseISO(lastActivity.date),
    start: parseISO(firstActivity.date),
  }).map((day) => {
    const date = formatISO(day, { representation: 'date' })

    if (calendar.has(date)) {
      return calendar.get(date) as Activity
    }

    return {
      count: 0,
      date,
      level: 0,
    }
  })
}

const groupByWeeks = (activities: Activity[]): Week[] => {
  if (activities.length === 0) {
    return []
  }

  const normalizedActivities = fillHoles(activities)
  const firstActivity = normalizedActivities[0] as Activity
  const firstDate = parseISO(firstActivity.date)
  const firstCalendarDate =
    getDay(firstDate) === 0 ? firstDate : subWeeks(nextDay(firstDate, 0), 1)

  const paddedActivities = [
    ...(new Array(differenceInCalendarDays(firstDate, firstCalendarDate)).fill(
      undefined
    ) as Activity[]),
    ...normalizedActivities,
  ]

  const numberOfWeeks = Math.ceil(paddedActivities.length / 7)

  return new Array(numberOfWeeks)
    .fill(undefined)
    .map((_, weekIndex) =>
      paddedActivities.slice(weekIndex * 7, weekIndex * 7 + 7)
    )
}

const getMonthLabels = (weeks: Week[]): MonthLabel[] =>
  weeks
    .reduce<MonthLabel[]>((labels, week, weekIndex) => {
      const firstActivity = week.find((activity) => activity !== undefined)

      if (!firstActivity) {
        throw new Error(
          `Unexpected error: Week ${weekIndex + 1} is empty: [${week}].`
        )
      }

      const month = MONTH_LABELS[getMonth(parseISO(firstActivity.date))]

      if (!month) {
        const monthName = new Date(firstActivity.date).toLocaleString('en-US', {
          month: 'short',
        })
        throw new Error(
          `Unexpected error: undefined month label for ${monthName}.`
        )
      }

      const prevLabel = labels.at(-1)

      if (weekIndex === 0 || !prevLabel || prevLabel.label !== month) {
        return labels.concat({ label: month, weekIndex })
      }

      return labels
    }, [])
    .filter(({ weekIndex }, index, labels) => {
      const minWeeks = 3

      if (index === 0) {
        const nextLabel = labels[1]
        return nextLabel ? nextLabel.weekIndex - weekIndex >= minWeeks : true
      }

      if (index === labels.length - 1) {
        return weeks.slice(weekIndex).length >= minWeeks
      }

      return true
    })

interface ContributionGraphProps extends HTMLAttributes<HTMLDivElement> {
  blockMargin?: number
  blockRadius?: number
  blockSize?: number
  children: ReactNode
  className?: string
  data: Activity[]
  fontSize?: number
  style?: CSSProperties
  totalCount?: number
}

export const ContributionGraph = ({
  data,
  blockMargin = 4,
  blockRadius = 2,
  blockSize = 12,
  fontSize = 14,
  style = {},
  totalCount: totalCountProp = undefined,
  className,
  children,
  ...props
}: ContributionGraphProps) => {
  const weeks = useMemo(() => groupByWeeks(data), [data])
  // 8px between the month labels and the first row
  const labelHeight = fontSize + 8

  const totalCount =
    typeof totalCountProp === 'number'
      ? totalCountProp
      : data.reduce((sum, activity) => sum + activity.count, 0)

  const width = weeks.length * (blockSize + blockMargin) - blockMargin
  const height = labelHeight + (blockSize + blockMargin) * 7 - blockMargin

  const contextValue = useMemo(
    () => ({
      blockMargin,
      blockRadius,
      blockSize,
      data,
      fontSize,
      height,
      labelHeight,
      totalCount,
      weeks,
      width,
    }),
    [
      blockMargin,
      blockRadius,
      blockSize,
      data,
      fontSize,
      height,
      labelHeight,
      totalCount,
      weeks,
      width,
    ]
  )

  if (data.length === 0) {
    return null
  }

  return (
    <ContributionGraphContext.Provider value={contextValue}>
      <div
        className={cn('flex w-max max-w-full flex-col gap-2', className)}
        style={{ fontSize, ...style }}
        {...props}
      >
        {children}
      </div>
    </ContributionGraphContext.Provider>
  )
}

interface ContributionGraphBlockProps extends HTMLAttributes<SVGRectElement> {
  activity: Activity
  dayIndex: number
  weekIndex: number
}

export const ContributionGraphBlock = ({
  activity,
  dayIndex,
  weekIndex,
  className,
  ...props
}: ContributionGraphBlockProps) => {
  const { blockSize, blockMargin, blockRadius, labelHeight } =
    useContributionGraph()

  if (activity.level < 0 || activity.level > MAX_LEVEL) {
    throw new RangeError(
      `Provided activity level ${activity.level} for ${activity.date} is out of range. It must be between 0 and ${MAX_LEVEL}.`
    )
  }

  return (
    <rect
      className={cn(contributionLevels, className)}
      data-count={activity.count}
      data-date={activity.date}
      data-level={activity.level}
      height={blockSize}
      rx={blockRadius}
      ry={blockRadius}
      width={blockSize}
      x={(blockSize + blockMargin) * weekIndex}
      y={labelHeight + (blockSize + blockMargin) * dayIndex}
      {...props}
    />
  )
}

interface ContributionGraphCalendarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: (props: {
    activity: Activity
    dayIndex: number
    weekIndex: number
  }) => ReactNode
  className?: string
  hideMonthLabels?: boolean
  title?: string
}

export const ContributionGraphCalendar = ({
  hideMonthLabels = false,
  title = 'Contribution graph',
  className,
  children,
  ...props
}: ContributionGraphCalendarProps) => {
  const { weeks, width, height, blockSize, blockMargin } =
    useContributionGraph()

  const monthLabels = getMonthLabels(weeks)

  return (
    <div
      className={cn('max-w-full overflow-x-auto overflow-y-hidden', className)}
      {...props}
    >
      <svg
        className='block max-w-none overflow-visible'
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
      >
        <title>{title}</title>
        {!hideMonthLabels && (
          <g
            className='fill-current selection:fill-selection-foreground'
            data-slot='month-labels'
          >
            {monthLabels.map(({ label, weekIndex }) => (
              <text
                dominantBaseline='hanging'
                key={weekIndex}
                x={(blockSize + blockMargin) * weekIndex}
              >
                {label}
              </text>
            ))}
          </g>
        )}
        {weeks.map((week, weekIndex) =>
          week.map((activity, dayIndex) => {
            if (!activity) {
              return null
            }

            return (
              <Fragment key={activity.date}>
                {children({ activity, dayIndex, weekIndex })}
              </Fragment>
            )
          })
        )}
      </svg>
    </div>
  )
}

interface ContributionGraphFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const ContributionGraphFooter = ({
  className,
  ...props
}: ContributionGraphFooterProps) => (
  <div
    className={cn(
      'flex flex-wrap gap-1 whitespace-nowrap sm:gap-x-4',
      className
    )}
    {...props}
  />
)

export const ContributionGraphTotalCount = ({
  children,
}: {
  children: (props: { totalCount: number }) => ReactNode
}) => {
  const { totalCount } = useContributionGraph()
  return <>{children({ totalCount })}</>
}

interface ContributionGraphLegendProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: (props: { level: number }) => ReactNode
}

export const ContributionGraphLegend = ({
  className,
  children,
  ...props
}: ContributionGraphLegendProps) => (
  <div
    className={cn('ml-auto flex items-center gap-[3px]', className)}
    {...props}
  >
    <span className='mr-1 text-muted-foreground'>Less</span>
    {Array.from({ length: MAX_LEVEL + 1 }, (_, level) => level).map((level) => (
      <Fragment key={`level-${level}`}>{children({ level })}</Fragment>
    ))}
    <span className='ml-1 text-muted-foreground'>More</span>
  </div>
)
