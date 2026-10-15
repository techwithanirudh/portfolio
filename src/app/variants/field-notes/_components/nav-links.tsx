'use client'

import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { nav } from './notes'

/** A pen stroke under the current page, like underlining in a notebook. */
function Underline() {
  return (
    <svg
      aria-hidden
      className='fn-ink-stroke pointer-events-none absolute inset-x-1 -bottom-0.5 h-2 w-[calc(100%-0.5rem)] text-[var(--fn-pen)]'
      preserveAspectRatio='none'
      viewBox='0 0 60 8'
    >
      <path d='M2 5.2c9-2.4 22-3 34-2.2 7 .5 14 1.3 22 .4' strokeWidth='1.8' />
    </svg>
  )
}

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav aria-label='Field notes pages'>
      <ul className='flex items-center gap-0.5 text-[15px] sm:gap-1'>
        {nav.map((item) => {
          const active =
            item.href === nav[0].href
              ? pathname === item.href
              : pathname.startsWith(item.href)
          return (
            <li key={item.href}>
              <Link
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative block rounded-sm px-2 py-1 transition-colors',
                  active
                    ? 'text-[var(--fn-ink)]'
                    : 'text-[var(--fn-muted)] hover:text-[var(--fn-ink)]'
                )}
                href={item.href}
              >
                {item.label}
                {active ? <Underline /> : null}
              </Link>
            </li>
          )
        })}
        <li>
          <Link
            className='flex items-center gap-0.5 rounded-sm px-2 py-1 text-[var(--fn-muted)] transition-colors hover:text-[var(--fn-ink)]'
            href='/blog'
          >
            Writing
            <ArrowUpRight aria-hidden className='size-3.5' />
          </Link>
        </li>
      </ul>
    </nav>
  )
}
