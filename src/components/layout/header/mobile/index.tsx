'use client'

import { Presence } from '@radix-ui/react-presence'
import { useSearchContext } from 'fumadocs-ui/contexts/search'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAssistantContext } from '@/components/features/assistant'
import { MenuPanel } from '@/components/layout/header/mobile/menu'
import { FloatingPill } from '@/components/layout/header/mobile/pill'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const previousPathname = useRef(pathname)
  const { setOpenSearch } = useSearchContext()
  const { setOpen: setOpenAssistant } = useAssistantContext()

  const closeMenu = useCallback(() => setOpen(false), [])

  // Safari 26 tints its bottom bar from the fixed elements at the bottom edge
  // (the fade and the pill) and does not re-read their color when it changes
  // in place. It does re-sample when they are added, so they are re-mounted
  // after every theme change. Hiding them made the tint follow the theme.
  const { resolvedTheme } = useTheme()
  const [tintGeneration, setTintGeneration] = useState(0)

  useEffect(() => {
    if (!resolvedTheme) {
      return
    }

    // Wait a frame so the new theme class is applied before re-mounting.
    const frame = requestAnimationFrame(() => setTintGeneration((n) => n + 1))
    return () => cancelAnimationFrame(frame)
  }, [resolvedTheme])

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

  // There is no overlay element while the menu is open (Safari 26 sampled it
  // for the browser-UI tint). The dim is a pseudo-element on <html> driven by
  // this attribute, and taps outside the menu are caught here instead. The tap
  // only closes the menu and does not reach the page underneath.
  useEffect(() => {
    if (!open) {
      return
    }

    document.documentElement.setAttribute('data-mobile-menu-open', '')

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest('#mobile-navigation-menu, [data-mobile-nav-pill]')
      ) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      closeMenu()
    }

    document.addEventListener('click', closeOnOutsideClick, true)
    return () => {
      document.documentElement.removeAttribute('data-mobile-menu-open')
      document.removeEventListener('click', closeOnOutsideClick, true)
    }
  }, [closeMenu, open])

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
