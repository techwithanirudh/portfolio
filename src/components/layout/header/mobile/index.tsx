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
        <button
          aria-label='Close menu'
          // No background-color on purpose: Safari 26 samples a full-screen
          // fixed element with a background for its browser-UI tint, and that
          // color went stale on a theme toggle while the menu was open. The
          // dim is a backdrop-filter instead: a 50% white wash in light mode
          // (invert, halve, invert) and a 50% darken in dark mode.
          className='fixed inset-0 z-[31] [-webkit-backdrop-filter:blur(4px)_invert(1)_brightness(0.5)_invert(1)] [backdrop-filter:blur(4px)_invert(1)_brightness(0.5)_invert(1)] data-[state=closed]:animate-fd-fade-out data-[state=open]:animate-fd-fade-in md:hidden dark:[-webkit-backdrop-filter:blur(4px)_brightness(0.5)] dark:[backdrop-filter:blur(4px)_brightness(0.5)]'
          data-state={open ? 'open' : 'closed'}
          onClick={closeMenu}
          type='button'
        />
      </Presence>

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
