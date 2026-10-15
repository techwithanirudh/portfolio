'use client'

import { Icons } from '@/components/icons/icons'
import { NavItem } from '@/components/layout/header/mobile/item'
import { iconButtonClassName } from '@/components/ui/button'
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
    {
      href: '/projects',
      icon: <Icons.work className='size-4' />,
      label: 'Projects',
    },
  ]

  return (
    // A compact dock centered over the page, not a full width bar
    <div className='pointer-events-none fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[42] flex justify-center md:hidden'>
      <div className='pointer-events-auto flex items-center gap-0.5 bg-popover/90 p-1 shadow-md ring ring-foreground/10 backdrop-blur-md dark:ring-foreground/20'>
        <button
          aria-label='Search'
          className={cn(
            iconButtonClassName,
            'transition-[color,scale] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-90'
          )}
          onClick={onSearchOpen}
          type='button'
        >
          <Icons.search className='size-4' />
        </button>

        <div className='mx-1 h-5 w-px bg-line' />

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
            'relative flex size-8 items-center justify-center transition-[color,background-color,scale] active:scale-90',
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
