'use client'

import { useTheme } from 'next-themes'
import { Fragment, useEffect, useState } from 'react'

/**
 * Safari 26 derives the browser UI tint from `<body>` or from a qualifying
 * fixed/sticky element near the viewport edge. It does not re-read a fixed
 * element whose color changes in place, but it does re-sample when one is
 * added or removed. These strips are the tint source, and they are replaced
 * after every theme change so the new color is picked up without a reload.
 *
 * They sit under the header and the mobile bottom fade (same color, lower
 * z-index), so they are not visible.
 */
export function BrowserTint() {
  const { resolvedTheme } = useTheme()
  const [generation, setGeneration] = useState(0)

  useEffect(() => {
    if (!resolvedTheme) {
      return
    }

    // Wait a frame so the new theme class is applied before replacing them.
    const frame = requestAnimationFrame(() => setGeneration((n) => n + 1))
    return () => cancelAnimationFrame(frame)
  }, [resolvedTheme])

  return (
    <Fragment key={generation}>
      <div
        aria-hidden
        className='pointer-events-none fixed inset-x-0 top-0 z-0 h-1 bg-background'
      />
      <div
        aria-hidden
        className='pointer-events-none fixed inset-x-0 bottom-0 z-0 h-1 bg-background md:hidden'
      />
    </Fragment>
  )
}
