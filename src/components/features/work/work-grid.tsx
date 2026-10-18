import { ViewAnimation } from '@/components/view-animation'
import type { WorkPage } from '@/lib/source'
import { cn } from '@/lib/utils'
import { WorkCard } from './work-card'

const columns = {
  lg: 'lg:grid-cols-2 lg:dashed-grid-2',
  md: 'md:grid-cols-2 md:dashed-grid-2',
}

const filler = {
  lg: 'lg:block',
  md: 'md:block',
}

interface WorkGridProps {
  className?: string
  /** Where the grid splits into two columns */
  columnsFrom?: keyof typeof columns
  /** How many leading covers load eagerly */
  eagerCount?: number
  works: WorkPage[]
}

export const WorkGrid = ({
  className,
  columnsFrom = 'lg',
  eagerCount = 0,
  works,
}: WorkGridProps) => (
  <div
    className={cn(
      'dashed-grid grid grid-cols-1 text-left',
      columns[columnsFrom],
      className
    )}
  >
    {works.map((work, index) => (
      <ViewAnimation delay={0.05 * index} key={work.url}>
        <WorkCard
          description={work.data.description ?? ''}
          image={work.data.image ?? null}
          priority={index < eagerCount}
          slugs={work.slugs}
          title={work.data.title ?? 'Untitled'}
          url={work.url}
        />
      </ViewAnimation>
    ))}
    {works.length % 2 === 1 && (
      <div
        aria-hidden
        className={cn('hidden bg-dashed', filler[columnsFrom])}
      />
    )}
  </div>
)
