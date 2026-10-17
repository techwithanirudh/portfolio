'use client'

import { useSound } from '@web-kits/audio/react'
import { cva } from 'class-variance-authority'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
import { Icons } from '@/components/icons/icons'
import { toggleOn } from '@/lib/audio/minimal'
import { MEDIA } from '@/lib/media'
import { cn } from '@/lib/utils'

type Theme = 'light' | 'dark' | 'system'

const itemVariants = cva(
  'size-6.5 rounded-sm p-1.5 text-muted-foreground transition-[color,background-color,scale] duration-150 ease-out-strong',
  {
    variants: {
      active: {
        false: 'text-muted-foreground hover:text-foreground',
        true: 'bg-accent text-accent-foreground',
      },
    },
  }
)

const lightDarkActive = {
  dark: 'dark:bg-accent dark:text-accent-foreground',
  light:
    'bg-accent text-accent-foreground dark:bg-transparent dark:text-muted-foreground',
} as const

const subscribeNoop = () => () => undefined

const full = [
  ['light', Icons.sun] as const,
  ['dark', Icons.moon] as const,
  ['system', Icons.desktop] as const,
]

const shouldSkipViewTransitionForBrowserTint = () =>
  window.matchMedia(MEDIA.coarsePointer).matches

export function ThemeToggle({
  className,
  mode = 'light-dark',
}: {
  className?: string
  mode?: 'light-dark' | 'light-dark-system'
}) {
  const { resolvedTheme, setTheme, theme } = useTheme()
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  )
  const playToggle = useSound(toggleOn)

  const handleChangeTheme = async (next: Theme) => {
    playToggle()

    function update() {
      setTheme(next)
    }

    if (
      document.startViewTransition &&
      next !== resolvedTheme &&
      !shouldSkipViewTransitionForBrowserTint()
    ) {
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
    'inline-flex items-center rounded-lg border bg-background p-1 transition-[scale] duration-150 ease-out-strong active:scale-[0.96]',
    className
  )

  if (mode === 'light-dark') {
    return (
      <button
        aria-label={'Toggle theme'}
        className={cn(
          container,
          'relative after:absolute after:inset-x-0 after:-inset-y-0.5'
        )}
        data-sound-press='off'
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
              className={cn(
                itemVariants({ active: false }),
                lightDarkActive[key]
              )}
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
    <div
      aria-label='Theme'
      className={container}
      data-theme-toggle=''
      role='group'
    >
      {full.map(([key, Icon]) => (
        <button
          aria-label={`${key[0]?.toUpperCase()}${key.slice(1)} theme`}
          aria-pressed={value === key}
          // Taller hit area only, since the segments sit flush side by side
          className={cn(
            itemVariants({ active: value === key }),
            'relative after:absolute after:inset-x-0 after:-inset-y-[7px]'
          )}
          data-sound-press='off'
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
