import { ViewAnimation } from '@/components/view-animation'
import type { ProjectPage } from '@/lib/source'
import { staggerDelay } from '@/lib/stagger'
import { cn } from '@/lib/utils'
import { ProjectCard } from './project-card'

const columns = {
  lg: 'lg:grid-cols-2 lg:dashed-grid-2',
  md: 'md:grid-cols-2 md:dashed-grid-2',
}

const filler = {
  lg: 'lg:block',
  md: 'md:block',
}

interface ProjectGridProps {
  className?: string
  /** Where the grid splits into two columns */
  columnsFrom?: keyof typeof columns
  /** How many leading covers load eagerly */
  priorityCoverCount?: number
  projects: ProjectPage[]
}

export const ProjectGrid = ({
  className,
  columnsFrom = 'lg',
  priorityCoverCount = 0,
  projects,
}: ProjectGridProps) => (
  <div
    className={cn(
      'dashed-grid grid grid-cols-1 text-left',
      columns[columnsFrom],
      className
    )}
  >
    {projects.map((project, index) => (
      <ViewAnimation delay={staggerDelay(index)} key={project.url}>
        <ProjectCard
          description={project.data.description ?? ''}
          image={project.data.image ?? null}
          priority={index < priorityCoverCount}
          title={project.data.title}
          transitionName={project.slugs.join('/')}
          url={project.url}
        />
      </ViewAnimation>
    ))}
    {projects.length % 2 === 1 && (
      <div
        aria-hidden
        className={cn('hidden bg-dashed', filler[columnsFrom])}
      />
    )}
  </div>
)
