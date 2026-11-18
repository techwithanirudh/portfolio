import { ViewAnimation } from '@/components/view-animation'
import type { ProjectPage } from '@/lib/source'
import { staggerDelay } from '@/lib/stagger'
import { cn } from '@/lib/utils'
import { ProjectCard } from './project-card'

interface ProjectGridProps {
  className?: string
  /** Shows only this many below `sm`, for previews that end in a "View all" link */
  phoneLimit?: number
  projects: ProjectPage[]
}

export const ProjectGrid = ({
  className,
  phoneLimit,
  projects,
}: ProjectGridProps) => (
  <div
    className={cn(
      'dashed-grid lg:dashed-grid-2 grid grid-cols-1 text-left lg:grid-cols-2',
      className
    )}
  >
    {projects.map((project, index) => (
      <ViewAnimation
        className={cn(
          phoneLimit !== undefined &&
            (index >= phoneLimit
              ? 'max-sm:hidden'
              : // The last shown card drops the divider `dashed-grid` gives it
                index === phoneLimit - 1 && 'max-sm:border-b-0!')
        )}
        delay={staggerDelay(index)}
        key={project.url}
      >
        <ProjectCard
          description={project.data.description ?? ''}
          image={project.data.image ?? null}
          title={project.data.title}
          transitionName={project.slugs.join('/')}
          url={project.url}
        />
      </ViewAnimation>
    ))}
    {projects.length % 2 === 1 && (
      <div aria-hidden className='hidden bg-dashed lg:block' />
    )}
  </div>
)
