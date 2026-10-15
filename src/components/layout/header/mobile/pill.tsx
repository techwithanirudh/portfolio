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
    <div className='fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[32] flex md:hidden'>
      <div className='flex w-full items-center gap-0.5 rounded-2xl bg-popover/90 py-1 pr-1 pl-2.5 shadow-md ring ring-foreground/10 backdrop-blur-md dark:ring-foreground/20'>
        <button
          aria-label='Search'
          className='flex h-8 min-w-20 flex-1 items-center gap-2 text-muted-foreground text-sm transition-[color,scale] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-95'
          onClick={onSearchOpen}
          type='button'
        >
          <Icons.search className='size-4' />
          Search
        </button>

        <div className='mr-1 ml-2.5 h-5 w-px bg-line' />

        {primaryLinks.map((link) => (
          <NavItem
            href={link.href}
            icon={link.icon}
            key={link.href}
            label={link.label}
            nested={link.href !== '/'}
          />
        ))}

        <div className='mx-1 h-5 w-px bg-line' />

        <button
          aria-controls={menuId}
          aria-expanded={open}
          aria-label='Toggle menu'
          className={cn(
            'relative flex size-8 items-center justify-center rounded-xl transition-[color,background-color,scale] active:scale-90',
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
