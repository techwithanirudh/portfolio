import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { LocalTime } from './local-time'

/** The top line of each page, like the header of a notebook page. */
export function PageHead({ no, title }: { no: string; title: string }) {
  return (
    <div className='fn-wrap'>
      <div className='flex items-center justify-between gap-4 border-[var(--fn-rule)] border-b border-dashed py-3'>
        <p className='fn-label'>
          No. {no} <span aria-hidden>·</span> {title}
        </p>
        <p className='fn-label'>
          <LocalTime format='letterhead' />
        </p>
      </div>
    </div>
  )
}

/** A section title: a small mono label, a serif heading, an optional link. */
export function SectionHeading({
  action,
  aside,
  className,
  id,
  label,
  title,
}: {
  action?: { href: string; label: string }
  aside?: ReactNode
  className?: string
  id: string
  label: string
  title: ReactNode
}) {
  return (
    <div className={cn('mb-8 sm:mb-10', className)}>
      <p className='fn-label mb-2'>{label}</p>
      <div className='flex flex-wrap items-end justify-between gap-x-6 gap-y-2'>
        <h2
          className='fn-serif text-[2.1rem] leading-[1.05] sm:text-[2.6rem]'
          id={id}
        >
          {title}
          {aside ? (
            <span className='fn-hand ml-3 inline-block -rotate-2 align-middle text-[1.35rem]'>
              {aside}
            </span>
          ) : null}
        </h2>
        {action ? (
          <Link
            className='fn-link fn-link-pen mb-1 text-[15px]'
            href={action.href}
          >
            {action.label} <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>
    </div>
  )
}
