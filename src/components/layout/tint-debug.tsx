'use client'

// cspell:ignore tintdebug

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'

type Group = 'header' | 'fade' | 'pill' | 'strips' | 'progress' | 'all'

const selectors: Record<Exclude<Group, 'all'>, () => Element[]> = {
  fade: () =>
    [...document.querySelectorAll('div.pointer-events-none.fixed')].filter(
      (el) => el.className.includes('bottom-0') && !el.className.includes('h-1')
    ),
  header: () => [...document.querySelectorAll('#nd-nav')],
  pill: () => {
    const wrapper = document
      .querySelector('[aria-label="Search"]')
      ?.closest('.fixed')
    return wrapper ? [wrapper] : []
  },
  progress: () => [...document.querySelectorAll('.bprogress')],
  strips: () => [...document.querySelectorAll('div.fixed.h-1')],
}

const labels: Record<Group, string> = {
  all: 'ALL fixed + sticky',
  fade: 'bottom fade',
  header: 'header',
  pill: 'pill',
  progress: 'progress bar',
  strips: 'edge strips',
}

/** Temporary: only active with the tint debug query param, to bisect Safari tint issues. */
export function TintDebug() {
  const { resolvedTheme, setTheme } = useTheme()
  const [enabled, setEnabled] = useState(false)
  const [hidden, setHidden] = useState<Group[]>([])
  const panel = useRef<HTMLDivElement>(null)
  const saved = useRef(new Map<Element, string>())

  useEffect(() => {
    setEnabled(new URLSearchParams(location.search).has('tintdebug'))
  }, [])

  if (!enabled) {
    return null
  }

  const hide = (el: Element) => {
    if (panel.current?.contains(el) || el.contains(panel.current)) {
      return
    }
    const node = el as HTMLElement
    saved.current.set(node, node.style.display)
    node.style.display = 'none'
  }

  const toggle = (group: Group) => {
    const on = hidden.includes(group)
    const targets =
      group === 'all'
        ? [...document.querySelectorAll('body *')].filter((el) => {
            const position = getComputedStyle(el).position
            return position === 'fixed' || position === 'sticky'
          })
        : selectors[group]()

    for (const el of targets) {
      if (on) {
        ;(el as HTMLElement).style.display = saved.current.get(el) ?? ''
        saved.current.delete(el)
      } else {
        hide(el)
      }
    }
    setHidden(on ? hidden.filter((g) => g !== group) : [...hidden, group])
  }

  return (
    <div
      className='absolute top-20 right-2 left-2 z-[100] rounded-xl border bg-background p-3 text-foreground text-sm shadow-lg'
      ref={panel}
    >
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
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          type='button'
        >
          Toggle theme (site setTheme)
        </button>
      </div>
    </div>
  )
}
