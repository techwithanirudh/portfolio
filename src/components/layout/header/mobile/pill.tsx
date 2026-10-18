'use client'

import { Icons } from '@/components/icons/icons'
import { NavItem } from '@/components/layout/header/mobile/item'
import { cn } from '@/lib/utils'

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
  // TODO(slopradar): duplication: Home/About/Projects hrefs and labels restate linkItems in constants/navigation, derive them from there
  const primaryLinks = [
    { href: '/', icon: <Icons.home className='size-4' />, label: 'Home' },
    {
      href: '/about',
      icon: <Icons.user className='size-4' />,
      label: 'About',
    },
    {
      href: '/projects',
      icon: <Icons.work className='size-4' />,
      label: 'Projects',
    },
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
          // TODO(slopradar): duplication: the same round icon button classes are spelled out here, on the menu toggle below and in mobile/item.tsx, share one cva or class constant (x3)
          className='relative flex size-8 touch-manipulation select-none items-center justify-center rounded-full text-muted-foreground transition-[color,background-color,scale] duration-150 ease-out-strong after:absolute after:-inset-1.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-96'
          onClick={onSearchOpen}
          type='button'
        >
          <Icons.search className='size-4' />
        </button>

        <div className='h-4 w-px bg-border' />

        {primaryLinks.map((link) => (
          <NavItem
            href={link.href}
            icon={link.icon}
            key={link.href}
            label={link.label}
            nested={link.href !== '/'}
          />
        ))}

        <div className='h-4 w-px bg-border' />

        <button
          aria-controls={menuId}
          aria-expanded={open}
          aria-label='Toggle menu'
          className={cn(
            'relative flex size-8 touch-manipulation select-none items-center justify-center rounded-full transition-[color,background-color,scale] duration-150 ease-out-strong after:absolute after:-inset-1.5 active:scale-96',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
            open
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
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
