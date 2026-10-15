'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

/**
 * Swaps drafting film for blueprint. Both labels render and CSS picks one, so
 * the server markup matches the client before the theme is known.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      className='group inline-flex h-8 items-center gap-2 rounded-[3px] border border-(--line) bg-(--paper) px-2 text-(--ink-muted) transition-colors hover:border-(--line-strong) hover:text-(--ink)'
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      type='button'
    >
      <SunIcon aria-hidden className='size-3.5 dark:hidden' />
      <MoonIcon aria-hidden className='hidden size-3.5 dark:block' />
      <span className='ds-label hidden text-current sm:inline dark:hidden'>
        Film
      </span>
      <span className='ds-label hidden text-current dark:sm:inline'>
        Blueprint
      </span>
      <span className='sr-only'>Toggle theme</span>
    </button>
  )
}
