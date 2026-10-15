import { ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { CornerFrame, Placeholder } from './corner-frame'
import {
  detailLetter,
  finishes,
  finishOf,
  formatDay,
  pad,
  type WorkItem,
} from './data'
import { FinishLabel } from './finish-symbol'
import { Tag } from './tag'
import { ToggleGlyph } from './toggle-glyph'

/** Shared column template, so the header and every row land on one grid. */
const COLS =
  'grid grid-cols-[3.5rem_minmax(0,1fr)_3rem] md:grid-cols-[4.5rem_minmax(0,1.25fr)_minmax(0,1fr)_7.5rem_3.5rem]'

function Material({ tags, max = 3 }: { max?: number; tags: string[] }) {
  const shown = tags.slice(0, max)
  const rest = tags.length - shown.length
  return (
    <span className='flex flex-wrap gap-1'>
      {shown.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
      {rest > 0 && <Tag className='text-(--ink-faint)'>+{rest}</Tag>}
    </span>
  )
}

function HeaderRow({ action }: { action: string }) {
  return (
    <div aria-hidden className='flex border-(--line) border-b bg-(--paper)'>
      <div className={cn(COLS, 'flex-1 items-center py-2 pr-2')}>
        <span className='ds-label pl-4 md:pl-6'>Item</span>
        <span className='ds-label'>Part</span>
        <span className='ds-label hidden md:block'>Material</span>
        <span className='ds-label hidden md:block'>Finish</span>
        <span className='ds-label text-right md:text-left'>Year</span>
      </div>
      <span className='ds-label hidden w-24 items-center justify-end pr-4 md:flex md:pr-6'>
        {action}
      </span>
    </div>
  )
}

function RowCells({ index, item }: { index: number; item: WorkItem }) {
  const finish = finishOf(item)
  return (
    <>
      <span className='pt-0.5 pl-4 font-mono text-(--ink-muted) text-[13px] tabular-nums md:pl-6'>
        {pad(index + 1)}
      </span>
      <span className='min-w-0 pr-4'>
        <span className='flex items-center gap-2'>
          <span className='font-medium text-[15px] leading-6'>
            {item.title}
          </span>
          {item.pinned && (
            <span className='ds-label text-(--ink-faint) max-sm:hidden'>
              Pinned
            </span>
          )}
        </span>
        <span className='mt-0.5 line-clamp-2 text-(--ink-muted) text-sm md:line-clamp-1'>
          {item.description}
        </span>
        <span className='mt-2 flex flex-wrap items-center gap-2 md:hidden'>
          <FinishLabel finish={finish} />
          <Material max={2} tags={item.tags} />
        </span>
      </span>
      <span className='hidden min-w-0 pt-0.5 pr-4 md:block'>
        <Material tags={item.tags} />
      </span>
      <span className='hidden pt-1 md:block'>
        <FinishLabel finish={finish} />
      </span>
      <span className='pt-0.5 pr-4 text-right font-mono text-[13px] tabular-nums md:pr-0 md:text-left'>
        {item.year}
      </span>
    </>
  )
}

function DetailView({ index, item }: { index: number; item: WorkItem }) {
  const finish = finishOf(item)
  const letter = detailLetter(index)
  const rule = finishes.find((f) => f.finish === finish)?.rule

  return (
    <div className='grid gap-6 border-(--line) border-t border-dashed bg-(--paper)/60 px-4 py-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:px-6'>
      <figure className='min-w-0'>
        <CornerFrame>
          {item.image ? (
            <div className='relative aspect-[16/10] overflow-hidden border border-(--line) bg-(--sheet)'>
              <Image
                alt={`${item.title} cover`}
                className='object-cover'
                fill
                sizes='(min-width: 1024px) 520px, 100vw'
                src={item.image}
              />
            </div>
          ) : (
            <Placeholder
              className='aspect-[16/10]'
              label={`[cover: ${item.title}]`}
            />
          )}
        </CornerFrame>
        <figcaption className='ds-label mt-3 flex items-center gap-2'>
          <span className='grid size-5 place-items-center rounded-full border border-(--ink) text-(--ink) text-[10px]'>
            {letter}
          </span>
          <span className='text-(--ink)'>Detail {letter}</span>
          <span className='text-(--ink-faint)'>·</span>
          <span>Item {pad(index + 1)}</span>
          <span className='text-(--ink-faint)'>·</span>
          <span>Scale NTS</span>
        </figcaption>
      </figure>

      <div className='flex min-w-0 flex-col gap-5'>
        <div>
          <p className='ds-label mb-1.5'>
            Item {pad(index + 1)}
            {item.pinned && ' · Pinned'}
          </p>
          <h3 className='font-semibold text-[20px] leading-tight tracking-tight'>
            {item.title}
          </h3>
          <p className='mt-2 text-(--ink-muted) text-[15px] leading-relaxed'>
            {item.description}
          </p>
        </div>
        <dl className='grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-2.5 border-(--line) border-t pt-4 text-sm'>
          <dt className='ds-label pt-0.5'>Dated</dt>
          <dd className='font-mono text-[13px]'>{formatDay(item.date)}</dd>
          <dt className='ds-label pt-0.5'>Finish</dt>
          <dd className='flex flex-wrap items-center gap-x-2'>
            <FinishLabel finish={finish} />
            {rule && (
              <span className='text-(--ink-muted) text-xs'>
                derived: {rule}
              </span>
            )}
          </dd>
          <dt className='ds-label pt-0.5'>Material</dt>
          <dd>
            <Material max={8} tags={item.tags} />
          </dd>
        </dl>
        <div className='mt-auto flex flex-wrap gap-2'>
          <Link
            className='inline-flex h-8 items-center gap-1.5 rounded-[3px] bg-(--ink) px-3 font-medium text-(--sheet) text-sm transition-opacity hover:opacity-85'
            href={item.url}
          >
            Case study
            <ArrowRightIcon aria-hidden className='size-3.5' />
          </Link>
          {item.website && (
            <a
              className='inline-flex h-8 items-center gap-1.5 rounded-[3px] border border-(--line) bg-(--sheet) px-3 text-sm transition-colors hover:border-(--ink)'
              href={item.website}
              rel='noopener'
              target='_blank'
            >
              Live site
              <ArrowUpRightIcon aria-hidden className='size-3.5' />
            </a>
          )}
          {item.github && (
            <a
              className='inline-flex h-8 items-center gap-1.5 rounded-[3px] border border-(--line) bg-(--sheet) px-3 text-sm transition-colors hover:border-(--ink)'
              href={item.github}
              rel='noopener'
              target='_blank'
            >
              Source
              <ArrowUpRightIcon aria-hidden className='size-3.5' />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * The bill of materials. `full` rows open into a detail view with the cover
 * framed as DETAIL A, B…; `compact` rows (the Home teaser) link straight to
 * the case study.
 */
export function Bom({
  items,
  variant = 'full',
}: {
  items: WorkItem[]
  variant?: 'full' | 'compact'
}) {
  return (
    <div>
      <HeaderRow action={variant === 'full' ? 'Detail' : 'Open'} />
      <ol>
        {items.map((item, index) =>
          variant === 'compact' ? (
            <li
              className='ds-row-rule border-(--line) border-b'
              key={item.slug}
            >
              <Link
                className='group flex cursor-crosshair transition-colors hover:bg-(--hover)'
                href={item.url}
              >
                <span className={cn(COLS, 'flex-1 items-start py-3.5 pr-2')}>
                  <RowCells index={index} item={item} />
                </span>
                <span className='hidden w-24 items-center justify-end pr-4 text-(--ink-muted) group-hover:text-(--ink) md:flex md:pr-6'>
                  <ArrowRightIcon aria-hidden className='size-4' />
                </span>
              </Link>
            </li>
          ) : (
            <Collapsible asChild defaultOpen={index === 0} key={item.slug}>
              <li className='ds-row-rule border-(--line) border-b'>
                <CollapsibleTrigger className='group/toggle flex w-full cursor-crosshair text-left transition-colors hover:bg-(--hover) data-[state=open]:bg-(--accent-wash)'>
                  <span className={cn(COLS, 'flex-1 items-start py-3.5 pr-2')}>
                    <RowCells index={index} item={item} />
                  </span>
                  <span className='hidden w-24 items-center justify-end gap-2 pr-4 md:flex md:pr-6'>
                    <span className='ds-label text-(--ink-faint) group-hover/toggle:text-(--ink-muted)'>
                      {detailLetter(index)}
                    </span>
                    <ToggleGlyph />
                  </span>
                  <span className='sr-only'>
                    Toggle detail for {item.title}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className='ds-collapsible'>
                  <DetailView index={index} item={item} />
                </CollapsibleContent>
              </li>
            </Collapsible>
          )
        )}
      </ol>
    </div>
  )
}
