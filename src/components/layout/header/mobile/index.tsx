'use client'

import { Presence } from '@radix-ui/react-presence'
import { useSearchContext } from 'fumadocs-ui/contexts/search'
import { usePathname } from 'next/navigation'
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
      {/* The fixed wrapper has no background and the visuals are absolute
          children: Safari 26 samples fixed elements at the bottom edge for
          browser-UI tint, which would go stale on a theme toggle. */}
      <div
        aria-hidden
        className='pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[calc(4rem+env(safe-area-inset-bottom,0px))] md:hidden'
      >
        <div className='absolute inset-x-0 bottom-[env(safe-area-inset-bottom,0px)] h-16 bg-gradient-to-t from-background to-transparent' />
        <div className='absolute inset-x-0 bottom-0 h-[env(safe-area-inset-bottom,0px)] bg-background' />
      </div>

      <Presence present={open}>
        <button
          aria-label='Close menu'
          // backdrop-blur keeps this full-screen overlay from being sampled
          // as a Safari 26 browser-UI tint source while the menu is open.
          className='fixed inset-0 z-[31] bg-background/50 backdrop-blur-sm data-[state=closed]:animate-fd-fade-out data-[state=open]:animate-fd-fade-in md:hidden'
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
