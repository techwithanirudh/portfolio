'use client'

import { Presence } from '@radix-ui/react-presence'
import { useSearchContext } from 'fumadocs-ui/contexts/search'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAISearchContext } from '@/components/ai/chat'
import { FloatingPill } from '@/components/mobile-nav/floating-pill'
import { MenuPanel } from '@/components/mobile-nav/menu-panel'

export function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const previousPathname = useRef(pathname)
  const { setOpenSearch } = useSearchContext()
  const { setOpen: setOpenAI } = useAISearchContext()

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return
    }

    previousPathname.current = pathname
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) {
      return
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [closeMenu, menuOpen])

  return (
    <>
      <Presence present={menuOpen}>
        <button
          aria-label='Close menu'
          className='fixed inset-0 z-[31] bg-background/50 data-[state=closed]:animate-fd-fade-out data-[state=open]:animate-fd-fade-in md:hidden'
          data-state={menuOpen ? 'open' : 'closed'}
          onClick={closeMenu}
          type='button'
        />
      </Presence>

      <Presence present={menuOpen}>
        <MenuPanel
          menuId='mobile-navigation-menu'
          menuOpen={menuOpen}
          onAIChatOpen={() => {
            closeMenu()
            setOpenAI(true)
          }}
          onClose={closeMenu}
        />
      </Presence>

      <FloatingPill
        menuId='mobile-navigation-menu'
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((open) => !open)}
        onSearchOpen={() => {
          closeMenu()
          setOpenSearch(true)
        }}
      />
    </>
  )
}
