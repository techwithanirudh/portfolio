'use client'

import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { themeColor } from '@/lib/theme-color'

// The theme-color tags follow prefers-color-scheme, not the in-site toggle, so
// Android Chrome's bar would stay light over a dark page
export function ThemeColorSync() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (resolvedTheme !== 'dark' && resolvedTheme !== 'light') {
      return
    }
    for (const meta of document.querySelectorAll<HTMLMetaElement>(
      'meta[name="theme-color"]'
    )) {
      meta.content = themeColor[resolvedTheme]
    }
  }, [resolvedTheme])

  return null
}
