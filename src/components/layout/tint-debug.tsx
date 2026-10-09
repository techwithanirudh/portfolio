'use client'

// cspell:ignore tintdebug

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

type Group =
  | 'header'
  | 'fade'
  | 'pill'
  | 'overlay'
  | 'panel'
  | 'progress'
  | 'all'

// Hidden with an injected stylesheet (not inline styles) so the hiding
// survives the elements being re-mounted on a theme change.
const selectors: Record<Group, string> = {
  all: '.fixed:not(.tint-debug), .sticky, #nd-nav',
  fade: 'div.pointer-events-none.fixed.inset-x-0.bottom-0',
  header: '#nd-nav',
  overlay: '[aria-label="Close menu"]',
  panel: '#mobile-navigation-menu',
  pill: 'div.fixed:has([aria-label="Search"])',
  progress: '.bprogress',
}

const labels: Record<Group, string> = {
  all: 'ALL fixed + sticky',
  fade: 'bottom fade',
  header: 'header',
  overlay: 'menu overlay',
  panel: 'menu panel',
  pill: 'pill',
  progress: 'progress bar',
}

/** Temporary: only active with the tint debug query param, to bisect Safari tint issues. */
export function TintDebug() {
  const { resolvedTheme, setTheme } = useTheme()
  const [enabled, setEnabled] = useState(false)
  const [hidden, setHidden] = useState<Group[]>([])

  useEffect(() => {
    setEnabled(new URLSearchParams(location.search).has('tintdebug'))
  }, [])

  if (!enabled) {
    return null
  }

  const toggle = (group: Group) =>
    setHidden((current) =>
      current.includes(group)
        ? current.filter((g) => g !== group)
        : [...current, group]
    )

  const css = hidden
    .map((group) => `${selectors[group]} { display: none !important; }`)
    .join('\n')

  return (
    <>
      <style>{css}</style>
      <div className='tint-debug absolute top-20 right-2 left-2 z-[100] rounded-xl border bg-background p-3 text-foreground text-sm shadow-lg'>
        <p className='mb-2 font-medium'>Tint debug · theme: {resolvedTheme}</p>
        <p className='mb-2 text-muted-foreground text-xs'>
          Hide parts, then toggle the theme and watch the Safari bars.
        </p>
        <div className='grid grid-cols-2 gap-2'>
          {(Object.keys(labels) as Group[]).map((group) => (
            <button
              className='rounded-lg border px-2 py-2 text-left'
              key={group}
              onClick={() => toggle(group)}
              type='button'
            >
              {hidden.includes(group) ? 'show' : 'hide'} {labels[group]}
            </button>
          ))}
          <button
            className='col-span-2 rounded-lg border bg-primary px-2 py-3 text-primary-foreground'
            onClick={() =>
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
            type='button'
          >
            Toggle theme (site setTheme)
          </button>
        </div>
      </div>
    </>
  )
}
