import type { Metadata } from 'next'
import { getWork } from '../../_shared/profile'
import { Artboard } from '../_components/artboard'
import { ProjectCard } from '../_components/cards'
import { stackTags } from '../_components/data'
import { BoardHeader } from '../_components/sections'
import {
  FilterItem,
  FilterSummary,
  InlineStackFilter,
  RegisterStackTags,
} from '../_components/work-filter'

export const metadata: Metadata = {
  description: 'Every project, as one artboard of components.',
  title: 'Work',
}

export default function ArtboardWork() {
  const work = getWork()
  const tags = stackTags(work)
  const counts = Object.fromEntries(tags.map((t) => [t.tag, t.count]))
  const first = Math.min(...work.map((w) => w.year))
  const last = Math.max(...work.map((w) => w.year))

  return (
    <Artboard id='all-projects' name='All projects' page='Work'>
      <RegisterStackTags tags={tags} />
      <div className='p-6 sm:p-10'>
        <h1 className='sr-only'>Work</h1>
        <BoardHeader
          count={work.length}
          description={`Apps, templates, agents, research and games from ${first} to ${last}. Pinned first, then newest. Select a card to inspect it; double-click to open the case study.`}
          title='All projects'
        />
        <div className='mt-6 grid gap-3'>
          <FilterSummary counts={counts} total={work.length} />
          <InlineStackFilter />
        </div>
        <ul className='mt-8 grid gap-5 sm:grid-cols-2'>
          {work.map((item, i) => (
            <FilterItem key={item.slug} tags={item.tags}>
              <ProjectCard item={item} priority={i < 2} />
            </FilterItem>
          ))}
        </ul>
      </div>
    </Artboard>
  )
}
