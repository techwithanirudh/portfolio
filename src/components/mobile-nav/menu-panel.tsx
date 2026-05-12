'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from '@/components/icons/icons'
import { ThemeToggle } from '@/components/sections/header/theme-toggle'
import { linkItems, socials } from '@/constants/navigation'
import { isActive } from '@/lib/is-active'
import { cn } from '@/lib/utils'

export function MenuPanel({
  menuOpen,
  onAIChatOpen,
  onClose,
}: {
  menuOpen: boolean
  onAIChatOpen: () => void
  onClose: () => void
}) {
  const pathname = usePathname()
  const menuItems = [
    {
      url: '/',
      text: 'Home',
      icon: <Icons.home />,
      active: 'url' as const,
    },
    ...linkItems,
  ].filter(
    (item): item is typeof item & { text: string; url: string } =>
      'url' in item && 'text' in item
  )
  const menuRows = Array.from(
    { length: Math.ceil(menuItems.length / 2) },
    (_, index) => menuItems.slice(index * 2, index * 2 + 2)
  )

  return (
    <div
      className={cn(
        'fixed inset-x-4 bottom-20 z-[32] overflow-hidden rounded-xl border border-dashed bg-background sm:hidden',
        menuOpen ? 'animate-fd-dialog-in' : 'animate-fd-dialog-out'
      )}
    >
      <nav className='flex flex-col divide-y divide-dashed divide-border'>
        {menuRows.map((row) => (
          <div
            className='grid grid-cols-2 divide-x divide-dashed divide-border'
            key={row.map((item) => item.url).join('-')}
          >
            {row.map((item) => {
              const activeType =
                'active' in item ? (item.active ?? 'url') : 'url'
              const active =
                activeType !== 'none' &&
                isActive(item.url, pathname, activeType === 'nested-url')

              return (
                <Link
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm transition-colors hover:bg-muted [&_svg]:size-3.5',
                    active
                      ? 'font-medium text-primary'
                      : 'text-muted-foreground'
                  )}
                  href={item.url}
                  key={item.url}
                  onClick={onClose}
                >
                  {'icon' in item ? item.icon : null}
                  {item.text}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
      <div className='flex items-center justify-between border-t border-dashed px-3 py-2'>
        <div className='flex items-center'>
          {socials.map((social) => (
            <a
              aria-label={social.name}
              className='flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-3.5'
              href={social.url}
              key={social.name}
              rel='noopener noreferrer'
              target='_blank'
            >
              {social.icon}
            </a>
          ))}
        </div>
        <div className='flex items-center gap-1'>
          <button
            aria-label='Ask AI'
            className='flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-3.5'
            onClick={onAIChatOpen}
            type='button'
          >
            <Icons.aiChat />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
