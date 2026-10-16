'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
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

  // Non-modal so the floating pill stays usable as the toggle. Base UI closes
  // on Escape and keeps the panel mounted until its exit animation ends
  return (
    <>
      <DialogPrimitive.Root
        disablePointerDismissal
        modal={false}
        onOpenChange={setOpen}
        open={open}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop
            className='fixed inset-0 z-[31] bg-background/50 data-closed:animate-fd-fade-out data-open:animate-fd-fade-in md:hidden'
            onClick={closeMenu}
          />
          <MenuPanel
            menuId='mobile-navigation-menu'
            onAssistantOpen={() => {
              closeMenu()
              setOpenAssistant(true)
            }}
            onClose={closeMenu}
          />
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

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
