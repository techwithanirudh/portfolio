'use client'

import { useSound } from '@web-kits/audio/react'
import { useTheme } from 'next-themes'
import { useCallback, useEffect } from 'react'
import { toggleOn } from '@/lib/audio/minimal'

type Theme = 'light' | 'dark' | 'system'

const themeToggleHandlers = new Set<() => void>()

function handleThemeToggleKeydown(event: KeyboardEvent) {
  if (
    event.key.toLowerCase() !== 'd' ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey
  ) {
    return
  }

  if (
    (event.target instanceof HTMLElement && event.target.isContentEditable) ||
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement ||
    event.target instanceof HTMLSelectElement
  ) {
    return
  }

  const toggleTheme = Array.from(themeToggleHandlers).pop()
  if (!toggleTheme) {
    return
  }

  event.preventDefault()
  toggleTheme()
}

export function useThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const playToggle = useSound(toggleOn)

  const changeTheme = useCallback(
    async (theme: Theme) => {
      playToggle()

      function update() {
        setTheme(theme)
      }

      if (document.startViewTransition && theme !== resolvedTheme) {
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
    },
    [playToggle, resolvedTheme, setTheme]
  )

  const toggleTheme = useCallback(() => {
    changeTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [changeTheme, resolvedTheme])

  useEffect(() => {
    themeToggleHandlers.add(toggleTheme)

    if (themeToggleHandlers.size === 1) {
      document.addEventListener('keydown', handleThemeToggleKeydown)
    }

    return () => {
      themeToggleHandlers.delete(toggleTheme)

      if (themeToggleHandlers.size === 0) {
        document.removeEventListener('keydown', handleThemeToggleKeydown)
      }
    }
  }, [toggleTheme])

  return { changeTheme, toggleTheme }
}
