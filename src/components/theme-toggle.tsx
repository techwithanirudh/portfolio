'use client'

import { useSound } from '@web-kits/audio/react'
import { cva } from 'class-variance-authority'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Icons } from '@/components/icons/icons'
import { META_THEME_COLORS } from '@/constants/site'
import { useMetaColor } from '@/hooks/use-meta-color'
import { useThemeShortcut } from '@/hooks/use-theme-shortcut'
import { toggleOn } from '@/lib/audio/minimal'
import { cn } from '@/lib/utils'

type Theme = 'light' | 'dark' | 'system'

const itemVariants = cva(
  'size-6.5 rounded-full p-1.5 text-fd-muted-foreground',
  {
    variants: {
      active: {
        false: 'text-fd-muted-foreground',
        true: 'bg-fd-accent text-fd-accent-foreground',
      },
    },
  }
)

const full = [
  ['light', Icons.sun] as const,
  ['dark', Icons.moon] as const,
  ['system', Icons.desktop] as const,
]

export function ThemeToggle({
  className,
  mode = 'light-dark',
}: {
  className?: string
  mode?: 'light-dark' | 'light-dark-system'
}) {
  const { resolvedTheme, setTheme, systemTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const playToggle = useSound(toggleOn)
  const { setMetaColor } = useMetaColor()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setMetaColor(
      resolvedTheme === 'dark'
        ? META_THEME_COLORS.dark
        : META_THEME_COLORS.light
    )
  }, [resolvedTheme, setMetaColor])

  useThemeShortcut()

  const handleChangeTheme = async (next: Theme) => {
    playToggle()

    let nextResolvedTheme = next
    if (next === 'system') {
      nextResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
    }

    setMetaColor(
      nextResolvedTheme === 'dark'
        ? META_THEME_COLORS.dark
        : META_THEME_COLORS.light
    )

    function update() {
      setTheme(next)
    }

    if (document.startViewTransition && next !== resolvedTheme) {
      document.documentElement.style.viewTransitionName = 'theme-transition'
      try {
        await document.startViewTransition(update).finished
      } catch (error) {
        if (!(error instanceof DOMException) || error.name !== 'AbortError') {
          throw error
        }
      } finally {
        document.documentElement.style.viewTransitionName = ''
      }
    } else {
      update()
    }
  }

  const container = cn(
    'inline-flex items-center rounded-full border p-1',
    className
  )

  if (mode === 'light-dark') {
    return (
      <button
        aria-label='Toggle theme'
        className={cn(
          'relative flex size-8 touch-manipulation items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
          className
        )}
        data-theme-toggle=''
        onClick={() => {
          const next = resolvedTheme === 'dark' ? 'light' : 'dark'
          handleChangeTheme(next === systemTheme ? 'system' : next)
        }}
        type='button'
      >
        <span aria-hidden className='absolute pointer-fine:hidden size-12' />
        <Icons.moon
          aria-hidden
          className={cn('hidden size-4 dark:block', !mounted && 'invisible')}
        />
        <Icons.sun
          aria-hidden
          className={cn('size-4 dark:hidden', !mounted && 'invisible')}
        />
      </button>
    )
  }

  const value = mounted ? theme : null

  return (
    <div className={container} data-theme-toggle=''>
      {full.map(([key, Icon]) => (
        <button
          aria-label={key}
          className={itemVariants({ active: value === key })}
          key={key}
          onClick={() => handleChangeTheme(key)}
          type='button'
        >
          <Icon className='size-full' fill='currentColor' />
        </button>
      ))}
    </div>
  )
}
