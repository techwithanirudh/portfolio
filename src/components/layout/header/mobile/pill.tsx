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
  const primaryLinks = [
    { href: '/', icon: <Icons.home className='size-4' />, label: 'Home' },
    {
      href: '/about',
      icon: <Icons.user className='size-4' />,
      label: 'About',
    },
    { href: '/work', icon: <Icons.work className='size-4' />, label: 'Work' },
  ]

  return (
    // The pill is itself the fixed element and is narrower than 80% of the
    // viewport, so Safari 26 never samples it as a browser-UI tint source (a
    // full-width fixed wrapper around it kept the bottom tint stale).
    <div className='fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 z-[32] w-max -translate-x-1/2 md:hidden'>
      <div className='flex items-center gap-0.5 rounded-full border bg-background px-1.5 py-1.5 shadow-lg'>
        <button
          aria-label='Search'
          className='flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
          onClick={onSearchOpen}
          type='button'
        >
          <Icons.search className='size-4' />
        </button>

        <div className='mx-1 h-4 w-px bg-border' />

        {primaryLinks.map((link) => (
          <NavItem
            href={link.href}
            icon={link.icon}
            key={link.href}
            label={link.label}
            nested={link.href !== '/'}
          />
        ))}

        <div className='mx-1 h-4 w-px bg-border' />

        <button
          aria-controls={menuId}
          aria-expanded={open}
          aria-label='Toggle menu'
          className={cn(
            'relative flex size-8 items-center justify-center rounded-full transition-colors',
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
    </div>
  )
}
