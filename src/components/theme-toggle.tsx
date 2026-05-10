'use client'

import { useSound } from '@web-kits/audio/react'
import { cva } from 'class-variance-authority'
import { useTheme } from 'next-themes'
import { startTransition, useSyncExternalStore } from 'react'
import { Icons } from '@/components/icons/icons'
import { toggleOn } from '@/lib/audio/minimal'
import { cn } from '@/lib/utils'

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

type Theme = 'light' | 'dark' | 'system'

export function ThemeToggle({
  className,
  mode = 'light-dark',
}: {
  className?: string
  mode?: 'light-dark' | 'light-dark-system'
}) {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const playToggle = useSound(toggleOn)

  const container = cn(
    'inline-flex items-center rounded-full border p-1',
    className
  )

  const handleChangeTheme = (newTheme: Theme) => {
    playToggle()

    const update = () => setTheme(newTheme)

    // document.startViewTransition is used here intentionally for the visual
    // theme-switch animation. React's startTransition handles the state update
    // inside so React stays in control of the theme change itself.
    if (document.startViewTransition && newTheme !== resolvedTheme) {
      document.documentElement.style.viewTransitionName = 'theme-transition'
      document
        .startViewTransition(() => {
          startTransition(update)
        })
        .finished.then(() => {
          document.documentElement.style.viewTransitionName = ''
        })
    } else {
      startTransition(update)
    }
  }

  if (mode === 'light-dark') {
    const value = mounted ? resolvedTheme : null

    return (
      <button
        aria-label={'Toggle Theme'}
        className={container}
        data-theme-toggle=''
        onClick={() => handleChangeTheme(value === 'light' ? 'dark' : 'light')}
        suppressHydrationWarning
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
