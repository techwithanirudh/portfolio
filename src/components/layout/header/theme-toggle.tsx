'use client'

import { useSound } from '@web-kits/audio/react'
import { cva } from 'class-variance-authority'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
import { Icons } from '@/components/icons/icons'
import type { SvgIcon } from '@/components/icons/utils'
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

const themeOptions = [
  { Icon: Icons.sun, label: 'Light theme', value: 'light' },
  { Icon: Icons.moon, label: 'Dark theme', value: 'dark' },
  { Icon: Icons.desktop, label: 'System theme', value: 'system' },
] as const satisfies readonly { Icon: SvgIcon; label: string; value: Theme }[]

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
          update()
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
        aria-label='Toggle theme'
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
        {themeOptions
          .filter((option) => option.value !== 'system')
          .map(({ Icon, value }) => (
            <Icon
              className={cn(
                itemVariants({ active: false }),
                lightDarkActive[value]
              )}
              fill='currentColor'
              key={value}
            />
          ))}
      </button>
    )
  }

  const value = mounted ? theme : null

  return (
    <fieldset aria-label='Theme' className={container} data-theme-toggle=''>
      {themeOptions.map(({ Icon, label, value: option }) => (
        <button
          aria-label={label}
          aria-pressed={value === option}
          className={cn(
            itemVariants({ active: value === option }),
            'relative after:absolute after:inset-x-0 after:-inset-y-[7px]'
          )}
          data-sound-press='off'
          key={option}
          onClick={() => handleChangeTheme(option)}
          type='button'
        >
          <Icon className='size-full' fill='currentColor' />
        </button>
      ))}
    </fieldset>
  )
}
