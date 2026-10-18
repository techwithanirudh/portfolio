import { WorkGrid } from '@/components/features/work/work-grid'
import { ListSection } from '@/components/layout/sections/list-section'
import { pages } from '@/constants/pages'
import type { WorkPage } from '@/lib/source'

export default function WorkPreview({ works }: { works: WorkPage[] }) {
  return (
    <ListSection
      description={pages.projects.description}
      more={{
        delay: 0.05 * works.length,
        href: pages.projects.path,
        label: 'View all projects',
      }}
      title={pages.projects.title}
    >
      <WorkGrid className='divider-top-dashed' works={works} />
    </ListSection>
  )
}
