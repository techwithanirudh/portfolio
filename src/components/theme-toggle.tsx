'use client'

import { useSound } from '@web-kits/audio/react'
import { cva } from 'class-variance-authority'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Icons } from '@/components/icons/icons'
import { useThemeShortcut } from '@/hooks/use-theme-shortcut'
import { toggleOn } from '@/lib/audio/minimal'
import { cn } from '@/lib/utils'

type Theme = 'light' | 'dark' | 'system'

const itemVariants = cva(
  'size-6.5 rounded-full p-1.5 text-fd-muted-foreground',
  {
    variants: {
      active: {
        true: 'bg-fd-accent text-fd-accent-foreground',
        false: 'text-fd-muted-foreground',
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
  const { resolvedTheme, setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const playToggle = useSound(toggleOn)

  useEffect(() => {
    setMounted(true)
  }, [])

  useThemeShortcut()

  const handleChangeTheme = async (next: Theme) => {
    playToggle()

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
    const value = mounted ? resolvedTheme : null

    return (
      <button
        aria-label={'Toggle Theme'}
        className={container}
        data-theme-toggle=''
        onClick={() =>
          handleChangeTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
        }
        type='button'
      >
        {full.map(([key, Icon]) => {
          if (key === 'system') {
            return null
          }

          return (
            <Icon
              className={itemVariants({ active: value === key })}
              fill='currentColor'
              key={key}
            />
          )
        })}
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
