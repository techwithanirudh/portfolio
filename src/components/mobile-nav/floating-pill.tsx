'use client'

import { Icons } from '@/components/icons/icons'
import { NavItem } from '@/components/mobile-nav/nav-item'
import { cn } from '@/lib/utils'

export function FloatingPill({
  menuOpen,
  onMenuToggle,
  onSearchOpen,
}: {
  menuOpen: boolean
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
    <div className='fixed inset-x-0 bottom-[calc(--spacing(2)+env(safe-area-inset-bottom,0))] z-[22] flex justify-center sm:hidden'>
      <div className='flex items-center gap-0.5 rounded-xl bg-popover py-1 pr-1 pl-2.5 shadow-md ring ring-foreground/10 dark:ring-foreground/20'>
        <button
          aria-label='Search'
          className='flex size-8 touch-manipulation items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground'
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
          aria-label='Toggle menu'
          className={cn(
            'relative flex size-8 touch-manipulation items-center justify-center rounded-full transition-colors',
            menuOpen
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={onMenuToggle}
          type='button'
        >
          {menuOpen ? (
            <Icons.close className='size-4' />
          ) : (
            <Icons.menu className='size-4' />
          )}
        </button>
      </div>
    </div>
  )
}
