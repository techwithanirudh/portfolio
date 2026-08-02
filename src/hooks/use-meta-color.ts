'use client'

import { useTheme } from 'next-themes'
import { useCallback, useMemo } from 'react'
import { META_THEME_COLORS } from '@/constants/site'

export function useMetaColor() {
  const { resolvedTheme } = useTheme()

  const metaColor = useMemo(
    () =>
      resolvedTheme === 'dark'
        ? META_THEME_COLORS.dark
        : META_THEME_COLORS.light,
    [resolvedTheme]
  )

  const setMetaColor = useCallback((color: string) => {
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', color)

    // Safari doesn't reliably resample theme-color from a bare attribute
    // mutation -- it tends to only repaint the chrome on the next "real"
    // reflow (scroll, visibility change, animation). Forcing a synchronous
    // layout read here nudges it to pick up the change immediately instead
    // of waiting for an unrelated repaint elsewhere on the page.
    // biome-ignore lint/complexity/noVoid: intentional layout read to force a reflow
    void document.body.offsetHeight
  }, [])

  return { metaColor, setMetaColor }
}
