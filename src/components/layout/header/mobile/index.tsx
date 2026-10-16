'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { useSearchContext } from 'fumadocs-ui/contexts/search'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAssistantContext } from '@/components/features/assistant'
import { MenuPanel } from '@/components/layout/header/mobile/menu'
import { FloatingPill } from '@/components/layout/header/mobile/pill'

const MENU_ID = 'mobile-navigation-menu'
const FOCUSABLE = 'a[href], button:not([disabled])'
const KEEP_OPEN_SELECTOR = '[role="dialog"], [data-mobile-nav-pill]'
const DESKTOP_QUERY = '(min-width: 768px)'

const getToggle = () =>
  document.querySelector<HTMLElement>(`[aria-controls="${MENU_ID}"]`)
const getFocusable = () => [
  ...(document
    .getElementById(MENU_ID)
    ?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
  ...[getToggle()].filter((el): el is HTMLElement => el !== null),
]

// Safari 26 tints its bottom bar from the fixed elements at the bottom edge and
// does not re-read their color when it changes in place, but it re-samples
// elements that are added.
function useRemountAfterThemeApplied() {
  const { resolvedTheme } = useTheme()
  const [generation, setGeneration] = useState(0)

  useEffect(() => {
    if (!resolvedTheme) {
      return
    }

    const frame = requestAnimationFrame(() => setGeneration((n) => n + 1))
    return () => cancelAnimationFrame(frame)
  }, [resolvedTheme])

  return generation
}

// No dimming overlay (Safari would tint its bars from it), so outside taps are
// caught here instead
function useCloseMenuOnOutsideClick(open: boolean, closeMenu: () => void) {
  useEffect(() => {
    if (!open) {
      return
    }

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest(KEEP_OPEN_SELECTOR)
      ) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      closeMenu()
    }

    const desktop = window.matchMedia(DESKTOP_QUERY)
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        closeMenu()
      }
    }

    document.addEventListener('click', closeOnOutsideClick, true)
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      document.removeEventListener('click', closeOnOutsideClick, true)
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [closeMenu, open])
}

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const previousPathname = useRef(pathname)
  const { setOpenSearch } = useSearchContext()
  const { open: assistantOpen, setOpen: setOpenAssistant } =
    useAssistantContext()

  const closeMenu = useCallback(() => setOpen(false), [])

  const tintGeneration = useRemountAfterThemeApplied()
  useCloseMenuOnOutsideClick(open, closeMenu)

  useEffect(() => {
    if (assistantOpen) {
      closeMenu()
    }
  }, [assistantOpen, closeMenu])

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

    const onKeyDown = (event: KeyboardEvent) => {
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
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <div
        aria-hidden
        className='pointer-events-none fixed inset-x-0 bottom-0 z-[30] md:hidden'
        key={`fade-${tintGeneration}`}
      >
        <div className='mask-linear-[to_top,var(--background)_25%,transparent] h-24 bg-linear-to-b from-transparent to-background backdrop-blur-[1px]' />
        <div className='bg-background pb-[env(safe-area-inset-bottom,0)]' />
      </div>

      <DialogPrimitive.Root
        disablePointerDismissal
        modal={false}
        onOpenChange={setOpen}
        open={open}
      >
        <DialogPrimitive.Portal>
          <MenuPanel
            menuId={MENU_ID}
            onAssistantOpen={() => {
              closeMenu()
              setOpenAssistant(true)
            }}
            onClose={closeMenu}
          />
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <FloatingPill
        key={`pill-${tintGeneration}`}
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
