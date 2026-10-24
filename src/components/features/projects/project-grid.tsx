import { ViewAnimation } from '@/components/view-animation'
import type { ProjectPage } from '@/lib/source'
import { staggerDelay } from '@/lib/stagger'
import { cn } from '@/lib/utils'
import { ProjectCard } from './project-card'

interface ProjectGridProps {
  className?: string
  projects: ProjectPage[]
}

export const ProjectGrid = ({ className, projects }: ProjectGridProps) => (
  <div
    className={cn(
      'dashed-grid lg:dashed-grid-2 grid grid-cols-1 text-left lg:grid-cols-2',
      className
    )}
  >
    {projects.map((project, index) => (
      <ViewAnimation delay={staggerDelay(index)} key={project.url}>
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
