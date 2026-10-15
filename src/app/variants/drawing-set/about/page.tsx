import type { Metadata } from 'next'
import { hardware, software } from '@/constants/portfolio/uses'
import { groupedExperience, profile } from '../../_shared/profile'
import {
  currentRevision,
  firstRevision,
  pad,
  revisionSpan,
  revisions,
} from '../_components/data'
import { ExperienceItem } from '../_components/experience-item'
import {
  HandwrittenArrow,
  HandwrittenNote,
} from '../_components/handwritten-note'
import {
  Panel,
  PanelHeader,
  PanelMeta,
  PanelTitle,
  PanelTitleSup,
} from '../_components/panel'
import { RevisionTable } from '../_components/revision-table'
import { SectionDivider } from '../_components/section-divider'
import { SheetHeader } from '../_components/sheet-header'
import { TitleBlock } from '../_components/title-block'
import { ToolsList } from '../_components/tools-list'

export const metadata: Metadata = { title: 'About' }

export default function DrawingSetAbout() {
  const kinds = groupedExperience.filter((group) => group.items.length > 0)
  const total = kinds.reduce((sum, group) => sum + group.items.length, 0)
  const summary = [
    {
      label: 'First revision',
      value: `${firstRevision.letter} · ${firstRevision.year}`,
    },
    {
      label: 'Current revision',
      red: true,
      value: `${currentRevision.letter} · ${currentRevision.year}`,
    },
    { label: 'Revisions', value: pad(revisions.length) },
    { label: 'Span', value: `${revisionSpan} years` },
  ]

  return (
    <>
      <SheetHeader code='A-02' />

      <section aria-labelledby='ds-about-title' className='screen-line-bottom'>
        <div className='grid lg:grid-cols-[minmax(0,1fr)_20rem]'>
          <div className='relative px-4 pt-10 pb-10 md:px-6 lg:pt-14'>
            <p className='ds-label mb-4'>
              <span className='text-(--ink)'>About</span>
              <span className='px-1.5 text-(--ink-faint)'>/</span>
              Revision history
            </p>
            <h1 className='ds-display max-w-[16ch]' id='ds-about-title'>
              {revisions.length} revisions of the same drawing.
            </h1>
            <div className='mt-6 max-w-[58ch] space-y-3 text-(--ink-muted) text-[17px] leading-relaxed'>
              <p>
                <span className='text-(--ink)'>{profile.name}</span>,{' '}
                {profile.description.charAt(0).toLowerCase()}
                {profile.description.slice(1)}
              </p>
              <p>
                This sheet records how that happened. Each lettered row below is
                one change to the drawing, from the first Lego robot in{' '}
                {firstRevision.year} to revision {currentRevision.letter}, the
                current one, at {currentRevision.company?.name}. Open any row
                for the notes.
              </p>
            </div>
          </div>

          <dl className='grid grid-cols-2 border-(--line) border-dashed max-lg:border-t lg:grid-cols-1 lg:border-l'>
            {summary.map((item) => (
              <div
                className='relative flex flex-col justify-center gap-1 border-(--line) border-b nth-[3]:border-b-0 border-dashed px-4 py-4 last:border-b-0 odd:border-r md:px-6 lg:nth-[3]:border-b lg:odd:border-r-0'
                key={item.label}
              >
                <dt className='ds-label'>{item.label}</dt>
                <dd
                  className={
                    item.red
                      ? 'font-mono text-(--redline) text-[20px]'
                      : 'font-mono text-[20px]'
                  }
                >
                  {item.value}
                </dd>
                {item.red && (
                  <HandwrittenNote
                    aria-hidden
                    className='top-3 right-5 hidden rotate-[-4deg] items-end gap-1 lg:flex'
                  >
                    <HandwrittenArrow className='mb-[-6px] size-7 rotate-[25deg]' />
                    <span className='flex flex-col items-start leading-[0.95]'>
                      <span>the live one,</span>
                      <span>drawn in red</span>
                    </span>
                  </HandwrittenNote>
                )}
              </div>
            ))}
          </dl>
        </div>
      </section>

      <SectionDivider label='Revisions' n={2} />
      <Panel aria-labelledby='ds-revisions' id='revisions'>
        <PanelHeader>
          <PanelTitle id='ds-revisions'>
            Revision table
            <PanelTitleSup>({revisions.length})</PanelTitleSup>
          </PanelTitle>
          <PanelMeta>Oldest first · drawn by {profile.name}</PanelMeta>
        </PanelHeader>
        <div className='px-4 py-6 md:py-8 md:pr-8 md:pl-3'>
          <RevisionTable />
        </div>
      </Panel>

      <SectionDivider label='Experience' n={3} />
      <Panel aria-labelledby='ds-experience' id='experience'>
        <PanelHeader>
          <PanelTitle id='ds-experience'>
            Experience
            <PanelTitleSup>({total})</PanelTitleSup>
          </PanelTitle>
          <PanelMeta>Grouped by kind · {kinds.length} kinds</PanelMeta>
        </PanelHeader>
        {kinds.map((group, i) => (
          <section
            aria-labelledby={`ds-kind-${group.kind}`}
            className='grid border-(--line) border-b last:border-b-0 lg:grid-cols-[15rem_minmax(0,1fr)]'
            key={group.kind}
          >
            <header className='border-(--line) border-dashed px-4 pt-5 md:px-6 lg:border-r lg:py-6'>
              <p className='ds-label'>Kind {pad(i + 1)}</p>
              <h3
                className='mt-1 font-semibold text-[20px] tracking-tight'
                id={`ds-kind-${group.kind}`}
              >
                {group.label}
                <PanelTitleSup>({group.items.length})</PanelTitleSup>
              </h3>
            </header>
            <div className='px-4 md:px-6'>
              {group.items.map((experience) => (
                <ExperienceItem experience={experience} key={experience.id} />
              ))}
            </div>
          </section>
        ))}
      </Panel>

      <SectionDivider label='Tools' n={4} />
      <Panel aria-labelledby='ds-tools' id='tools'>
        <PanelHeader>
          <PanelTitle id='ds-tools'>
            Tools
            <PanelTitleSup>({hardware.length + software.length})</PanelTitleSup>
          </PanelTitle>
          <PanelMeta>
            Parts list
            <span className='text-(--ink-faint)'>·</span>
            Hardware {hardware.length}
            <span className='text-(--ink-faint)'>·</span>
            Software {software.length}
          </PanelMeta>
        </PanelHeader>
        <ToolsList />
      </Panel>

      <TitleBlock code='A-02' />
    </>
  )
}
