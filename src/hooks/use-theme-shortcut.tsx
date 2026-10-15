'use client'

import { useSound } from '@web-kits/audio/react'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { toggleOn } from '@/lib/audio/minimal'

export function useThemeShortcut() {
  const { resolvedTheme, setTheme } = useTheme()
  const playToggle = useSound(toggleOn)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() !== 'd' ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return
      }
      e.preventDefault()
      playToggle()
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [playToggle, resolvedTheme, setTheme])
}
