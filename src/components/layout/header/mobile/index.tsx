'use client'

import { useSearchContext } from 'fumadocs-ui/contexts/search'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAssistantContext } from '@/components/features/assistant'
import { MenuPanel } from '@/components/layout/header/mobile/menu'
import { FloatingPill } from '@/components/layout/header/mobile/pill'
import { useOiiaMode } from '@/components/oiia'
import { Presence } from '@/components/presence'

const MENU_ID = 'mobile-navigation-menu'
const FOCUSABLE = 'a[href], button:not([disabled])'

// The menu is modal: focus moves in on open, Tab cycles between the menu and
// its toggle, and closing from inside hands focus back to the toggle
const getToggle = () =>
  document.querySelector<HTMLElement>(`[aria-controls="${MENU_ID}"]`)
const getFocusable = () => [
  ...(document
    .getElementById(MENU_ID)
    ?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
  ...[getToggle()].filter((el): el is HTMLElement => el !== null),
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const previousPathname = useRef(pathname)
  const { setOpenSearch } = useSearchContext()
  const { setOpen: setOpenAssistant } = useAssistantContext()
  const { mode } = useOiiaMode()

  const closeMenu = useCallback(() => setOpen(false), [])
  const dismissMenu = useCallback(() => {
    setOpen(false)
    getToggle()?.focus()
  }, [])

  useEffect(() => {
    if (mode === 'oiia') {
      closeMenu()
    }
  }, [closeMenu, mode])

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return
    }

    previousPathname.current = pathname
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) {
      return
    }

    const frame = requestAnimationFrame(() => getFocusable()[0]?.focus())

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismissMenu()
        return
      }
      if (event.key !== 'Tab') {
        return
      }
      const focusable = getFocusable()
      const index = focusable.indexOf(document.activeElement as HTMLElement)
      const next = event.shiftKey ? index - 1 : index + 1
      event.preventDefault()
      focusable.at(next % focusable.length)?.focus()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [dismissMenu, open])

  if (mode === 'oiia') {
    return null
  }

  return (
    <>
      <Presence present={open}>
        <button
          aria-label='Close menu'
          className='fixed inset-0 z-[41] bg-background/50 data-[state=closed]:animate-fd-fade-out data-[state=open]:animate-fd-fade-in md:hidden'
          data-state={open ? 'open' : 'closed'}
          onClick={dismissMenu}
          tabIndex={-1}
          type='button'
        />
      </Presence>

      <Presence present={open}>
        <MenuPanel
          menuId={MENU_ID}
          onAssistantOpen={() => {
            closeMenu()
            setOpenAssistant(true)
          }}
          onClose={closeMenu}
          open={open}
        />
      </Presence>

      <FloatingPill
        menuId={MENU_ID}
        onMenuToggle={() => setOpen((value) => !value)}
        onSearchOpen={() => {
          closeMenu()
          setOpenSearch(true)
        }}
        open={open}
      />
    </>
  )
}
