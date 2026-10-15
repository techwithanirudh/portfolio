import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { getWork } from '../../_shared/profile'
import { tilt } from './notes'

export type WorkItem = ReturnType<typeof getWork>[number]

/** Small external link that sits above the card's stretched main link. */
function Extra({ href, label }: { href: string; label: string }) {
  return (
    <a
      className='fn-link relative z-10 inline-flex items-center gap-0.5 text-[13px] text-[var(--fn-muted)]'
      href={href}
      rel='noopener'
      target='_blank'
    >
      {label}
      <ArrowUpRight aria-hidden className='size-3' />
    </a>
  )
}

/**
 * A project on an index card: a pen rule under the title, the year in the
 * corner, the stack in mono. Pinned cards are taped to the wall. Hovering
 * lifts the card and straightens it.
 */
export function IndexCard({
  className,
  index,
  item,
  showImage = false,
}: {
  className?: string
  index: number
  item: WorkItem
  showImage?: boolean
}) {
  return (
    <article
      className={cn(
        'fn-index fn-card fn-tape group relative flex flex-col rounded-[3px] px-5 pt-5 pb-4 sm:px-6',
        className
      )}
      data-tape={item.pinned ? 'top' : 'none'}
      style={
        {
          '--fn-tape-tilt': `${tilt(index + 3)}deg`,
          '--fn-tilt': `${tilt(index, 0.32)}deg`,
        } as React.CSSProperties
      }
    >
      {showImage && item.image ? (
        <div className='fn-photo mb-5 -rotate-[0.6deg] pb-2'>
          <div className='relative aspect-[16/9] overflow-hidden'>
            <Image
              alt=''
              className='object-cover object-top'
              fill
              sizes='(min-width: 1024px) 400px, 90vw'
              src={item.image}
            />
          </div>
        </div>
      ) : null}
      <header className='fn-index-head flex items-start justify-between gap-4 pb-2'>
        <h3 className='fn-serif text-[1.55rem] leading-[1.1] sm:text-[1.7rem]'>
          <Link
            className='rounded-sm outline-none after:absolute after:inset-0 after:rounded-[3px] focus-visible:after:outline-2 focus-visible:after:outline-[var(--fn-pen)] focus-visible:after:outline-offset-4'
            href={item.url}
          >
            {item.title}
          </Link>
        </h3>
        <span className='fn-label shrink-0 pt-2 tabular-nums'>
          {item.pinned ? <span className='sr-only'>Pinned, </span> : null}
          {item.year}
        </span>
      </header>
      <p className='fn-ruled min-h-[5.25rem] flex-1 pt-1 text-[15px] text-[var(--fn-muted)]'>
        {item.description}
      </p>
      <footer className='mt-3 grid grid-cols-[1fr_auto] items-end gap-x-4'>
        <p className='font-mono text-[10.5px] text-[var(--fn-muted)] uppercase tracking-[0.08em]'>
          {item.tags.slice(0, 4).join(' · ')}
        </p>
        <div className='flex gap-3'>
          {item.website ? <Extra href={item.website} label='Live' /> : null}
          {item.github ? <Extra href={item.github} label='Code' /> : null}
        </div>
      </footer>
    </article>
  )
}
