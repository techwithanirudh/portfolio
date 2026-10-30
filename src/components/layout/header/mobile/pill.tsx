'use client'

import { Icons } from '@/components/icons/icons'
import { NavItem } from '@/components/layout/header/mobile/item'
import { pillItemVariants } from '@/components/layout/header/mobile/pill-item-variants'
import { pages } from '@/constants/pages'

export function FloatingPill({
  open,
  menuId,
  onMenuToggle,
  onSearchOpen,
}: {
  open: boolean
  menuId: string
  onMenuToggle: () => void
  onSearchOpen: () => void
}) {
  const primaryLinks = [
    { icon: <Icons.home className='size-4' />, page: pages.home },
    { icon: <Icons.user className='size-4' />, page: pages.about },
    { icon: <Icons.work className='size-4' />, page: pages.projects },
  ]

  return (
    // Named like the desktop header's nav, which is hidden whenever this shows
    <nav
      aria-label='Main'
      className='fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-32 flex justify-center md:hidden'
      data-mobile-nav-pill=''
    >
      <div className='flex items-center gap-1.5 rounded-full border bg-background p-1.5 shadow-lg'>
        <button
          aria-label='Search'
          className={pillItemVariants()}
          onClick={onSearchOpen}
          type='button'
        >
          <Icons.search className='size-4' />
        </button>

        <div className='h-4 w-px bg-border' />

        {primaryLinks.map(({ icon, page }) => (
          <NavItem
            href={page.path}
            icon={icon}
            key={page.path}
            label={page.title}
            nested={page !== pages.home}
          />
        ))}

        <div className='h-4 w-px bg-border' />

        <button
          aria-controls={menuId}
          aria-expanded={open}
          aria-label='Toggle menu'
          className={pillItemVariants({ active: open })}
          onClick={onMenuToggle}
          type='button'
        >
          {open ? (
            <Icons.close className='size-4' />
          ) : (
            <Icons.menu className='size-4' />
          )}
        </button>
      </div>
    </nav>
  )
}
