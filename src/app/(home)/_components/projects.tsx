import { ProjectGrid } from '@/components/features/projects/project-grid'
import { ListSection } from '@/components/layout/sections/list-section'
import { pages } from '@/constants/pages'
import type { ProjectPage } from '@/lib/source'
import { staggerDelay } from '@/lib/stagger'

export default function ProjectsPreview({
  projects,
}: {
  projects: ProjectPage[]
}) {
  return (
    <ListSection
      description={pages.projects.description}
      more={{
        delay: staggerDelay(projects.length),
        href: pages.projects.path,
        label: 'View all projects',
      }}
      title={pages.projects.title}
    >
      <ProjectGrid
        className='w-full border-t border-dashed'
        projects={projects}
      />
    </ListSection>
  )
}
