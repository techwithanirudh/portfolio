'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { useSearchContext } from 'fumadocs-ui/contexts/search'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAssistantContext } from '@/components/features/assistant'
import { MenuPanel } from '@/components/layout/header/mobile/menu'
import { FloatingPill } from '@/components/layout/header/mobile/pill'

const MENU_ID = 'mobile-navigation-menu'
const FOCUSABLE = 'a[href], button:not([disabled])'

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

  const closeMenu = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return
    }

    previousPathname.current = pathname
    setOpen(false)
  }, [pathname])

  // Base UI moves focus in on open, closes on Escape and hands focus back on
  // close. It's non-modal so the floating pill stays usable as the toggle, so
  // Tab is cycled by hand between the menu and that toggle
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
