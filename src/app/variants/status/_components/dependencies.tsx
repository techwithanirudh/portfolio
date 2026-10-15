import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { hardware, software } from '@/constants/portfolio/uses'
import type { HardwareItem, SoftwareItem } from '@/types'

const VISIBLE = 12

type Item = HardwareItem | SoftwareItem

const WWW = /^www\./

const hostOf = (url: string) => new URL(url).hostname.replace(WWW, '')

function Logo({ item }: { item: Item }) {
  const src = (item as SoftwareItem).logo ?? (item as HardwareItem).image
  const box =
    'relative size-7 shrink-0 overflow-hidden rounded-md bg-[var(--panel-raised)]'
  if (!src) {
    return (
      <span
        aria-hidden
        className={`${box} grid place-items-center font-medium text-[11px] text-[var(--muted)]`}
      >
        {item.name.slice(0, 1)}
      </span>
    )
  }
  if (typeof src === 'string') {
    return (
      <span className={box}>
        <Image
          alt=''
          className='object-contain p-1'
          fill
          sizes='28px'
          src={src}
        />
      </span>
    )
  }
  return (
    <span className={box}>
      <Image
        alt=''
        className='object-contain p-1 dark:hidden'
        fill
        sizes='28px'
        src={src.light}
      />
      <Image
        alt=''
        className='hidden object-contain p-1 dark:block'
        fill
        sizes='28px'
        src={src.dark}
      />
    </span>
  )
}

const rowClass =
  'group grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[color-mix(in_srgb,var(--panel-raised)_55%,transparent)] sm:px-5'

function Row({ item }: { item: Item }) {
  if (!item.url) {
    return (
      <li className={rowClass}>
        <Logo item={item} />
        <span className='min-w-0'>
          <span className='block truncate font-medium text-[13px]'>
            {item.name}
          </span>
          <span className='vs-num block truncate text-[11px] text-[var(--muted)]'>
            {item.description}
          </span>
        </span>
      </li>
    )
  }
  return (
    <li>
      <a className={rowClass} href={item.url} rel='noopener' target='_blank'>
        <Logo item={item} />
        <span className='min-w-0'>
          <span className='block truncate font-medium text-[13px]'>
            {item.name}
          </span>
          <span className='vs-num block truncate text-[11px] text-[var(--muted)]'>
            {item.description}
          </span>
        </span>
        <span className='vs-num hidden items-center gap-1 text-[11px] text-[var(--faint)] transition-colors group-hover:text-[var(--text)] sm:inline-flex'>
          {hostOf(item.url)}
          <ArrowUpRight aria-hidden className='size-3' />
        </span>
      </a>
    </li>
  )
}

function Manifest({
  items,
  name,
  note,
}: {
  items: Item[]
  name: string
  note: string
}) {
  const head = items.slice(0, VISIBLE)
  const rest = items.slice(VISIBLE)
  return (
    <div className='vs-card self-start overflow-hidden'>
      <div className='flex items-baseline justify-between gap-3 border-[var(--line)] border-b px-4 py-3 sm:px-5'>
        <p className='vs-num font-medium text-[13px]'>
          “{name}”
          <span className='ml-2 font-normal text-[var(--muted)]'>{note}</span>
        </p>
        <span className='vs-num text-[11px] text-[var(--muted)]'>
          {items.length}
        </span>
      </div>
      <ul className='divide-y divide-[var(--line)]'>
        {head.map((item) => (
          <Row item={item} key={item.name} />
        ))}
      </ul>
      {rest.length > 0 ? (
        <details className='group border-[var(--line)] border-t'>
          <summary className='vs-num cursor-pointer list-none px-4 py-3 text-[12px] text-[var(--muted)] transition-colors hover:text-[var(--text)] sm:px-5 [&::-webkit-details-marker]:hidden'>
            <span className='group-open:hidden'>+ {rest.length} more</span>
            <span className='hidden group-open:inline'>Show fewer</span>
          </summary>
          <ul className='divide-y divide-[var(--line)] border-[var(--line)] border-t'>
            {rest.map((item) => (
              <Row item={item} key={item.name} />
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  )
}

/** Uses as a manifest: hardware are dependencies, apps are dev dependencies. */
export function Dependencies() {
  const apps = software.toSorted(
    (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false)
  )
  return (
    <div className='grid gap-4 lg:grid-cols-2'>
      <Manifest items={hardware} name='dependencies' note='hardware' />
      <Manifest items={apps} name='devDependencies' note='software' />
    </div>
  )
}
