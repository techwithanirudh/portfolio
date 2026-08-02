'use client'

import { Presence } from '@radix-ui/react-presence'
import { useSearchContext } from 'fumadocs-ui/contexts/search'
import { useState } from 'react'
import { useAISearchContext } from '@/components/ai/chat'
import { FloatingPill } from '@/components/mobile-nav/floating-pill'
import { MenuPanel } from '@/components/mobile-nav/menu-panel'

export function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { setOpenSearch } = useSearchContext()
  const { setOpen: setOpenAI } = useAISearchContext()

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <div
        aria-hidden
        className='pointer-events-none fixed inset-x-0 bottom-0 z-20 sm:hidden'
      >
        <div className='h-16 bg-gradient-to-t from-background to-transparent' />
        <div className='bg-background pb-[env(safe-area-inset-bottom,0)]' />
      </div>

      <Presence present={menuOpen}>
        <button
          aria-label='Close menu'
          className='fixed inset-0 z-[21] bg-background/50 data-[state=closed]:animate-fd-fade-out data-[state=open]:animate-fd-fade-in sm:hidden'
          data-state={menuOpen ? 'open' : 'closed'}
          onClick={closeMenu}
          type='button'
        />
      </Presence>

      <Presence present={menuOpen}>
        <MenuPanel
          menuOpen={menuOpen}
          onAIChatOpen={() => {
            closeMenu()
            setOpenAI(true)
          }}
          onClose={closeMenu}
        />
      </Presence>

      <FloatingPill
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
