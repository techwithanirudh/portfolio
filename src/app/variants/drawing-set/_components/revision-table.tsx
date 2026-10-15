import Image from 'next/image'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { chapters, profile } from '../../_shared/profile'
import { Placeholder } from './corner-frame'
import {
  currentRevision,
  firstRevision,
  type Revision,
  revisionSpan,
  revisions,
} from './data'
import { DimensionLine } from './dimension-line'
import { RevisionCloud } from './revision-cloud'
import { Tag } from './tag'
import { RevTriangle } from './title-block'
import { ToggleGlyph } from './toggle-glyph'

const COLS =
  'grid grid-cols-[3rem_4.75rem_minmax(0,1fr)_1.5rem] md:grid-cols-[4rem_6rem_minmax(0,1fr)_4rem_2rem]'

const by = profile.name
  .split(' ')
  .map((part) => part[0])
  .join('.')
  .concat('.')

const chapterNumber = (revision: Revision) =>
  String(chapters.findIndex((c) => c.id === revision.chapter.id) + 1).padStart(
    2,
    '0'
  )

const photoLabel = (revision: Revision) =>
  `[photo: ${(revision.company?.name ?? revision.title).toLowerCase()}, ${revision.year}]`

function RevisionRow({ revision }: { revision: Revision }) {
  const current = revision.isCurrent
  return (
    <Collapsible defaultOpen={current}>
      <CollapsibleTrigger
        className={cn(
          COLS,
          'group/toggle w-full items-center py-3 text-left transition-colors hover:bg-(--hover)',
          current && 'text-(--redline)'
        )}
      >
        <span className='flex justify-center'>
          {current ? (
            <RevTriangle className='size-[22px]' letter={revision.letter} />
          ) : (
            <span className='font-medium font-mono text-[15px]'>
              {revision.letter}
            </span>
          )}
        </span>
        <span className='font-mono text-[13px] tabular-nums'>
          {revision.date}
        </span>
        <span className='min-w-0 pr-3'>
          <span className={cn('font-medium', !current && 'text-(--ink)')}>
            {revision.title}
          </span>
          {revision.company && (
            <span
              className={cn(current ? 'text-current' : 'text-(--ink-muted)')}
            >
              {' '}
              · {revision.company.name}
            </span>
          )}
          {current && (
            <span className='ds-label ml-2 inline-block text-current'>
              Current
            </span>
          )}
        </span>
        <span className='hidden font-mono text-(--ink-muted) text-[12px] md:block'>
          {by}
        </span>
        <span className='flex justify-end pr-3 md:justify-center md:pr-0'>
          <ToggleGlyph />
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent className='ds-collapsible'>
        <div className='grid gap-5 border-(--line) border-t border-dashed px-3 py-5 md:grid-cols-[minmax(0,1fr)_15rem] md:pr-5 md:pl-[10rem]'>
          <div className='min-w-0 space-y-3'>
            {revision.chapterStart && (
              <>
                <p className='ds-label'>
                  Chapter {chapterNumber(revision)} · {revision.chapter.years}
                </p>
                <h3 className='font-semibold text-(--ink) text-[20px] tracking-tight'>
                  {revision.chapter.title}
                </h3>
                <p className='max-w-[60ch] text-(--ink-muted) text-[15px] leading-relaxed'>
                  {revision.chapter.body}
                </p>
              </>
            )}
            {revision.company && revision.description && (
              <div className='flex items-start gap-3 pt-1'>
                {revision.company.logo && (
                  <Image
                    alt=''
                    aria-hidden
                    className='mt-0.5 rounded-full'
                    height={20}
                    src={revision.company.logo}
                    width={20}
                  />
                )}
                <p className='max-w-[58ch] text-(--ink) text-[15px] leading-relaxed'>
                  {revision.description}
                </p>
              </div>
            )}
            {revision.type && (
              <p className='ds-label'>
                {revision.type}
                {revision.company?.url && (
                  <>
                    <span className='px-1.5 text-(--ink-faint)'>·</span>
                    <a
                      className='ds-link hover:text-(--ink)'
                      href={revision.company.url}
                      rel='noopener'
                      target='_blank'
                    >
                      {new URL(revision.company.url).hostname.replace(
                        'www.',
                        ''
                      )}
                    </a>
                  </>
                )}
              </p>
            )}
            {revision.skills.length > 0 && (
              <ul className='flex flex-wrap gap-1.5'>
                {revision.skills.map((skill) => (
                  <li key={skill}>
                    <Tag>{skill}</Tag>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <figure className='max-md:max-w-60'>
            <Placeholder
              className='aspect-[4/3]'
              label={photoLabel(revision)}
            />
            <figcaption className='ds-label mt-2'>
              <span className='text-(--ink)'>Fig. {revision.letter}</span> · to
              be supplied
            </figcaption>
          </figure>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

/**
 * The career as a drawing's revision table: one lettered row per change,
 * oldest first. The current revision is drawn in redline inside a revision
 * cloud and opens by default; a vertical dimension measures the span.
 */
export function RevisionTable() {
  const span = `${revisionSpan} years`

  return (
    <div className='grid gap-4 md:grid-cols-[3.5rem_minmax(0,1fr)] md:gap-0'>
      <div className='hidden justify-center pt-10 md:flex'>
        <DimensionLine
          end={currentRevision.year}
          label={span}
          orientation='vertical'
          start={firstRevision.year}
        />
      </div>
      <DimensionLine
        className='md:hidden'
        end={currentRevision.year}
        label={span}
        start={firstRevision.year}
      />

      <div className='border border-(--line-strong)/70 bg-(--sheet)'>
        <div className='flex items-center justify-between border-(--line) border-b px-3 py-2'>
          <p className='ds-label text-(--ink)'>Revisions</p>
          <p className='ds-label'>
            {revisions.length} revs · {firstRevision.year}–
            {currentRevision.year}
          </p>
        </div>
        <div
          aria-hidden
          className={cn(COLS, 'border-(--line) border-b bg-(--paper) py-1.5')}
        >
          <span className='ds-label text-center'>Rev</span>
          <span className='ds-label'>Date</span>
          <span className='ds-label'>Description</span>
          <span className='ds-label hidden md:block'>By</span>
          <span />
        </div>
        <ol>
          {revisions.map((revision) => (
            <li
              className='border-(--line) border-b last:border-b-0'
              key={revision.id}
            >
              {revision.isCurrent ? (
                <RevisionCloud>
                  <RevisionRow revision={revision} />
                </RevisionCloud>
              ) : (
                <RevisionRow revision={revision} />
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/**
 * A compact strip of the same revisions for the Home sheet: one delta per
 * revision, the current one in redline, with the span dimensioned below.
 */
export function RevisionStrip() {
  return (
    <div>
      <ol className='relative grid grid-cols-8'>
        <span
          aria-hidden
          className='absolute top-[11px] right-[6.25%] left-[6.25%] h-px bg-(--line-strong)/60'
        />
        {revisions.map((revision) => (
          <li
            className='relative flex flex-col items-center gap-1.5'
            key={revision.id}
            title={`${revision.letter} · ${revision.date} · ${revision.title}${revision.company ? `, ${revision.company.name}` : ''}`}
          >
            <span
              className={cn(
                'relative grid place-items-center bg-(--sheet) px-0.5',
                revision.isCurrent ? 'text-(--redline)' : 'text-(--ink)'
              )}
            >
              <RevTriangle
                className={cn(
                  'size-[22px]',
                  !revision.isCurrent && 'text-(--ink)'
                )}
                letter={revision.letter}
              />
            </span>
            <span
              className={cn(
                'font-mono text-[11px] tabular-nums',
                revision.isCurrent ? 'text-(--redline)' : 'text-(--ink-muted)'
              )}
            >
              {revision.year}
            </span>
            <span className='sr-only'>
              {revision.title}
              {revision.company ? `, ${revision.company.name}` : ''}
            </span>
          </li>
        ))}
      </ol>
      <DimensionLine
        className='mx-[6.25%] mt-3'
        label={`${revisionSpan} years`}
      />
    </div>
  )
}
