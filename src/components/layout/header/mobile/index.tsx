'use client'

import { Presence } from '@radix-ui/react-presence'
import { useSearchContext } from 'fumadocs-ui/contexts/search'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAssistantContext } from '@/components/features/assistant'
import { MenuPanel } from '@/components/layout/header/mobile/menu'
import { FloatingPill } from '@/components/layout/header/mobile/pill'
import { useOiiaMode } from '@/components/oiia'

const MENU_OPEN_ATTRIBUTE = 'data-mobile-menu-open'
const KEEP_OPEN_SELECTOR = '#mobile-navigation-menu, [data-mobile-nav-pill]'

// Safari 26 tints its bottom bar from the fixed elements at the bottom edge and
// does not re-read their color when it changes in place, but it re-samples
// elements that are added. Keying them on this value re-mounts them.
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

// The dim behind the open menu is an `html[data-mobile-menu-open]::after`
// rule in globals.css, not an element, so taps outside the menu are caught here.
function useMobileMenuScrim(open: boolean, closeMenu: () => void) {
  useEffect(() => {
    if (!open) {
      return
    }

    document.documentElement.setAttribute(MENU_OPEN_ATTRIBUTE, '')

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

    document.addEventListener('click', closeOnOutsideClick, true)
    return () => {
      document.documentElement.removeAttribute(MENU_OPEN_ATTRIBUTE)
      document.removeEventListener('click', closeOnOutsideClick, true)
    }
  }, [closeMenu, open])
}

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const previousPathname = useRef(pathname)
  const { setOpenSearch } = useSearchContext()
  const { setOpen: setOpenAssistant } = useAssistantContext()
  const { mode } = useOiiaMode()

  const closeMenu = useCallback(() => setOpen(false), [])

  const tintGeneration = useRemountAfterThemeApplied()
  useMobileMenuScrim(open, closeMenu)

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

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [closeMenu, open])

  if (mode === 'oiia') {
    return null
  }

  return (
    <>
      <div
        aria-hidden
        className='pointer-events-none fixed inset-x-0 bottom-0 z-30 md:hidden'
        key={`fade-${tintGeneration}`}
      >
        <div className='h-16 bg-gradient-to-t from-background to-transparent' />
        <div className='bg-background pb-[env(safe-area-inset-bottom,0)]' />
      </div>

      <Presence present={open}>
        <MenuPanel
          menuId='mobile-navigation-menu'
          onAssistantOpen={() => {
            closeMenu()
            setOpenAssistant(true)
          }}
          onClose={closeMenu}
          open={open}
        />
      </Presence>

      <FloatingPill
        key={`pill-${tintGeneration}`}
        menuId='mobile-navigation-menu'
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
