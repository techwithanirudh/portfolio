import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** The heading row inside an artboard: title, optional count and a link. */
export function BoardHeader({
  action,
  className,
  count,
  description,
  title,
}: {
  action?: { href: string; label: string }
  className?: string
  count?: ReactNode
  description?: ReactNode
  title: string
}) {
  return (
    <header
      className={cn(
        'flex flex-wrap items-end justify-between gap-x-6 gap-y-2',
        className
      )}
    >
      <div className='min-w-0'>
        <h2
          className='ab-t-heading'
          data-layer={title}
          data-layer-type='text'
          data-outline-text
        >
          {title}
          {count ? (
            <sup className='ab-t-label -top-3 ml-1.5 font-normal text-(--muted)'>
              {count}
            </sup>
          ) : null}
        </h2>
        {description ? (
          <p className='ab-t-body mt-1 max-w-[56ch] text-(--muted)'>
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <Link
          className='group inline-flex items-center gap-1 font-medium text-(--sel) text-[13px]'
          href={action.href}
        >
          {action.label}
          <ArrowRight
            aria-hidden
            className='size-3.5 transition-transform duration-100 group-hover:translate-x-0.5'
          />
        </Link>
      ) : null}
    </header>
  )
}
