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

const itemVariants = cva('size-6.5 rounded-sm p-1.5 text-muted-foreground', {
  variants: {
    active: {
      false: 'text-muted-foreground',
      true: 'bg-accent text-accent-foreground',
    },
  },
})

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
    'inline-flex items-center rounded-md border bg-background p-1',
    className
  )

  if (mode === 'light-dark') {
    return (
      <button
        aria-label={'Toggle theme'}
        className={container}
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
    <div className={container} data-theme-toggle=''>
      {full.map(([key, Icon]) => (
        <button
          aria-label={key}
          className={itemVariants({ active: value === key })}
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
