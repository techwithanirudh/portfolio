'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

/** Paper by day, desk lamp by night. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const dark = mounted && resolvedTheme === 'dark'
  const label = dark ? 'Switch to paper (light)' : 'Switch to desk lamp (dark)'

  return (
    <button
      aria-label={label}
      className='grid size-9 place-items-center rounded-full text-[var(--fn-muted)] transition-colors hover:bg-[var(--fn-card)] hover:text-[var(--fn-ink)]'
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      title={label}
      type='button'
    >
      {dark ? (
        <Sun aria-hidden className='size-[18px]' strokeWidth={1.6} />
      ) : (
        <Moon aria-hidden className='size-[18px]' strokeWidth={1.6} />
      )}
    </button>
  )
}
