import { Suspense } from 'react'
import { getWork } from '../../_shared/profile'
import { PageHead } from '../_components/headings'
import { IndexCard } from '../_components/index-card'
import { Annotated, MarginNote } from '../_components/margin-note'
import { WorkWall } from '../_components/work-wall'

export const metadata = {
  title: 'Work',
}

const TAG_LIMIT = 12

export default function FieldNotesWork() {
  const items = getWork()
  // Tags are matched case-insensitively ("Turborepo" and "TurboRepo").
  const counts = new Map<string, { count: number; name: string }>()
  for (const item of items) {
    for (const tag of item.tags) {
      const key = tag.toLowerCase()
      const entry = counts.get(key)
      counts.set(key, {
        count: (entry?.count ?? 0) + 1,
        name: entry?.name ?? tag,
      })
    }
  }
  const tags = [...counts]
    .map(([key, { count, name }]) => ({ count, key, name }))
    .filter((t) => t.count > 1)
    .toSorted((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, TAG_LIMIT)
  const pinned = items.filter((i) => i.pinned).length
  const oldest = items.toSorted(
    (a, b) => a.date.getTime() - b.date.getTime()
  )[0]

  return (
    <>
      <PageHead no='03' title='Work' />
      <section aria-labelledby='fn-work' className='fn-wrap pt-14 sm:pt-20'>
        <Annotated
          note={
            <MarginNote arrow='down-left' className='lg:pt-24' rotate={-3}>
              the taped ones are pinned, {pinned} of them
            </MarginNote>
          }
        >
          <p className='fn-label mb-3'>Index cards</p>
          <h1 className='fn-display' id='fn-work'>
            Things I’ve <em className='italic'>made</em>.
          </h1>
          <p className='fn-measure mt-6 text-[1.15rem] text-[var(--fn-muted)] sm:text-[1.25rem]'>
            {items.length} projects, from {oldest?.title} in {oldest?.year} to
            the templates, agents and apps I’m shipping now. Each card opens the
            full write-up.
          </p>
        </Annotated>
        <div className='mt-12'>
          <Suspense
            fallback={
              <div className='grid max-w-[940px] gap-8 sm:grid-cols-2'>
                {items.map((item, i) => (
                  <IndexCard index={i} item={item} key={item.slug} showImage />
                ))}
              </div>
            }
          >
            <WorkWall items={items} tags={tags} />
          </Suspense>
        </div>
      </section>
    </>
  )
}
