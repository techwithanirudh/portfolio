'use client'

import { ArrowUpRightIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BASE, sheets } from './data'
import { ThemeToggle } from './theme-toggle'

/** The sheet tabs: every page is a numbered sheet of one drawing set. */
export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className='ds-ground sticky top-0 z-30 px-2 lg:px-10'>
      <div className='screen-line-bottom ds-col flex h-(--header-h) items-center gap-3 px-3 md:px-6'>
        <Link className='group mr-auto flex items-center gap-2.5' href={BASE}>
          <span
            aria-hidden
            className='relative grid size-7 place-items-center rounded-[3px] border border-(--ink) font-mono font-semibold text-[10px] tracking-tight'
          >
            AS
            <span className='absolute -right-[3px] -bottom-[3px] size-[5px] bg-(--redline)' />
          </span>
          <span className='hidden font-medium text-sm tracking-tight sm:inline'>
            Anirudh Sriram
          </span>
          <span className='ds-label hidden md:inline'>Drawing set</span>
        </Link>

        <nav aria-label='Sheets'>
          <ul className='flex items-center'>
            {sheets.slice(0, 4).map((sheet) => {
              const active = !sheet.external && pathname === sheet.href
              return (
                <li key={sheet.code}>
                  <Link
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex h-(--header-h) items-center gap-1.5 px-2 text-sm transition-colors md:px-3',
                      active
                        ? 'text-(--ink)'
                        : 'text-(--ink-muted) hover:text-(--ink)',
                      sheet.external && 'max-sm:hidden'
                    )}
                    href={sheet.href}
                  >
                    <span
                      className={cn(
                        'ds-label hidden text-current lg:inline',
                        active && 'text-(--accent)'
                      )}
                    >
                      {sheet.code}
                    </span>
                    <span
                      className={cn(
                        'relative',
                        active &&
                          'after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:bg-(--accent)'
                      )}
                    >
                      {sheet.name}
                    </span>
                    {sheet.external && (
                      <ArrowUpRightIcon
                        aria-hidden
                        className='size-3 text-(--ink-faint)'
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  )
}
