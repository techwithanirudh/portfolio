import type { Metadata } from 'next'
import { getWork } from '../../_shared/profile'
import { Bom } from '../_components/bom'
import { finishes, finishOf, pad } from '../_components/data'
import { DimensionLine } from '../_components/dimension-line'
import { FinishLabel } from '../_components/finish-symbol'
import {
  Panel,
  PanelHeader,
  PanelMeta,
  PanelTitle,
  PanelTitleSup,
} from '../_components/panel'
import { SectionDivider } from '../_components/section-divider'
import { SheetHeader } from '../_components/sheet-header'
import { TitleBlock } from '../_components/title-block'

export const metadata: Metadata = { title: 'Work' }

export default function DrawingSetWork() {
  const work = getWork()
  const years = work.map((item) => item.year)
  const first = Math.min(...years)
  const last = Math.max(...years)
  const pinned = work.filter((item) => item.pinned).length
  const counts = finishes
    .map((f) => ({
      ...f,
      count: work.filter((item) => finishOf(item) === f.finish).length,
    }))
    .filter((f) => f.count > 0)
  const materials = new Set(work.flatMap((item) => item.tags)).size

  return (
    <>
      <SheetHeader code='A-03' />

      <section aria-labelledby='ds-work-title' className='screen-line-bottom'>
        <div className='grid lg:grid-cols-[minmax(0,1fr)_24rem]'>
          <div className='px-4 pt-10 pb-10 md:px-6 lg:pt-14'>
            <p className='ds-label mb-4'>
              <span className='text-(--ink)'>Work</span>
              <span className='px-1.5 text-(--ink-faint)'>/</span>
              Bill of materials
            </p>
            <h1 className='ds-display max-w-[18ch]' id='ds-work-title'>
              {work.length} parts, one assembly.
            </h1>
            <p className='mt-6 max-w-[56ch] text-(--ink-muted) text-[17px] leading-relaxed'>
              Every project, listed the way a drawing lists its parts: numbered,
              with what it is made of and how it was finished. {pinned} pinned
              items come first, then the rest, newest first. Open a row for its
              detail view and the case study.
            </p>
            <DimensionLine
              className='mt-8 max-w-[34rem]'
              end={last}
              label={`${last - first} years of parts`}
              start={first}
            />
          </div>

          <div className='border-(--line) border-dashed max-lg:border-t lg:border-l'>
            <div className='flex items-center justify-between border-(--line) border-b px-4 py-2.5 md:px-6'>
              <p className='ds-label text-(--ink)'>Finish schedule</p>
              <p className='ds-label'>Qty</p>
            </div>
            <ul>
              {counts.map((f) => (
                <li
                  className='grid grid-cols-[7.5rem_minmax(0,1fr)_2rem] items-center gap-3 border-(--line) border-b border-dashed px-4 py-2.5 md:px-6'
                  key={f.finish}
                >
                  <FinishLabel finish={f.finish} />
                  <span className='text-(--ink-muted) text-xs'>{f.rule}</span>
                  <span className='text-right font-mono text-[13px] tabular-nums'>
                    {pad(f.count)}
                  </span>
                </li>
              ))}
            </ul>
            <div className='px-4 py-4 md:px-6'>
              <p className='ds-label mb-2 text-(--ink)'>General notes</p>
              <ol className='list-inside list-decimal space-y-1 text-(--ink-muted) text-xs leading-relaxed marker:font-mono'>
                <li>
                  Finish is derived from each project&apos;s data, not set by
                  hand.
                </li>
                <li>
                  Most specific finish wins: Research, Template, Archived, then
                  Shipped.
                </li>
                <li>
                  {materials} distinct materials across {work.length} parts.
                </li>
                <li>Do not scale this drawing.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider label='Bill of materials' n={2} />
      <Panel aria-labelledby='ds-bom' id='bom'>
        <PanelHeader>
          <PanelTitle id='ds-bom'>
            Bill of materials
            <PanelTitleSup>({work.length})</PanelTitleSup>
          </PanelTitle>
          <PanelMeta>
            Items 01–{pad(work.length)}
            <span className='text-(--ink-faint)'>·</span>
            Pinned {pad(pinned)}
            <span className='text-(--ink-faint)'>·</span>
            {first}–{last}
          </PanelMeta>
        </PanelHeader>
        <Bom items={work} />
      </Panel>

      <TitleBlock code='A-03' />
    </>
  )
}
