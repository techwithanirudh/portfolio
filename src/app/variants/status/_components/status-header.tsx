import { Rss } from 'lucide-react'
import Link from 'next/link'
import { LiveTime } from './live-time'
import { StatusDot } from './status-dot'

interface StatusHeaderProps {
  latest?: { title: string; url: string; when: string }
}

/**
 * The bar under the nav: overall status, the latest deploy (the newest
 * project by date), the time in IST and an RSS subscribe link.
 */
export function StatusHeader({ latest }: StatusHeaderProps) {
  return (
    <div className='border-[var(--line)] border-b bg-[var(--panel)]'>
      <div className='mx-auto flex h-11 max-w-[1200px] items-center gap-4 px-4 text-[13px] sm:px-6'>
        <p className='flex min-w-0 items-center gap-2.5'>
          <StatusDot pulse />
          <span className='truncate font-medium'>All systems operational</span>
        </p>
        {latest ? (
          <p className='hidden min-w-0 items-center gap-2 text-[var(--muted)] md:flex'>
            <span aria-hidden className='text-[var(--line-strong)]'>
              /
            </span>
            <span className='vs-label'>Latest deploy</span>
            <Link
              className='truncate text-[var(--text)] underline decoration-[var(--line-strong)] underline-offset-4 transition-colors hover:decoration-[var(--text)]'
              href={latest.url}
            >
              {latest.title}
            </Link>
            <span className='vs-num text-[12px]'>{latest.when}</span>
          </p>
        ) : null}
        <div className='ml-auto flex shrink-0 items-center gap-4 text-[var(--muted)]'>
          <p className='hidden items-center gap-1.5 sm:flex'>
            <span className='vs-label'>Updated</span>
            <LiveTime className='vs-num text-[12px] text-[var(--text)]' />
          </p>
          <a
            className='inline-flex items-center gap-1.5 rounded-md px-1 transition-colors hover:text-[var(--text)]'
            href='/rss.xml'
          >
            <Rss aria-hidden className='size-3.5' strokeWidth={2} />
            Subscribe
          </a>
        </div>
      </div>
    </div>
  )
}
