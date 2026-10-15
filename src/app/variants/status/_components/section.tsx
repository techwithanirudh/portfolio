import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  action?: { href: string; label: string }
  children: ReactNode
  className?: string
  /** Mono overline, e.g. a count or a short status line. */
  eyebrow?: ReactNode
  id?: string
  title: string
}

/** Page section with a status-page style heading row. */
export function Section({
  action,
  children,
  className,
  eyebrow,
  id,
  title,
}: SectionProps) {
  const headingId = id ? `${id}-title` : undefined
  return (
    <section
      aria-labelledby={headingId}
      className={cn('scroll-mt-28', className)}
      id={id}
    >
      <div className='mb-4 flex items-end justify-between gap-4'>
        <div className='min-w-0'>
          {eyebrow ? <p className='vs-label mb-1.5'>{eyebrow}</p> : null}
          <h2
            className='font-semibold text-[18px] tracking-tight'
            id={headingId}
          >
            {title}
          </h2>
        </div>
        {action ? (
          <Link
            className='group inline-flex shrink-0 items-center gap-1 text-[13px] text-[var(--muted)] transition-colors hover:text-[var(--text)]'
            href={action.href}
          >
            {action.label}
            <ArrowRight
              aria-hidden
              className='size-3.5 transition-transform group-hover:translate-x-0.5'
            />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  )
}
