'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dark = mounted && resolvedTheme === 'dark'

  return (
    <button
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--panel-raised)] hover:text-[var(--text)]',
        className
      )}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      type='button'
    >
      {dark ? (
        <Sun aria-hidden className='size-4' strokeWidth={1.75} />
      ) : (
        <Moon aria-hidden className='size-4' strokeWidth={1.75} />
      )}
    </button>
  )
}
