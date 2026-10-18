'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from '@/components/icons/icons'
import { ThemeToggle } from '@/components/layout/header/theme-toggle'
import { linkItems, socials } from '@/constants/navigation'
import { isActive } from '@/lib/is-active'
import { cn } from '@/lib/utils'

export function MenuPanel({
  menuId,
  onAssistantOpen,
  onClose,
}: {
  menuId: string
  onAssistantOpen: () => void
  onClose: () => void
}) {
  const pathname = usePathname()
  const menuItems = [
    {
      active: 'url' as const,
      icon: <Icons.home />,
      text: 'Home',
      url: '/',
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
    <DialogPrimitive.Popup
      aria-label='Mobile navigation'
      className='fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[32] max-h-[calc(100dvh-7rem)] origin-bottom overflow-y-auto overscroll-contain rounded-xl border border-dashed bg-background outline-none transition-[opacity,scale] duration-200 ease-out-strong data-ending-style:scale-96 data-starting-style:scale-96 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-150 md:hidden'
      id={menuId}
    >
      <nav className='dashed-stack flex flex-col'>
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
                    'flex touch-manipulation select-none items-center gap-2 px-4 py-3 text-sm transition-colors [-webkit-touch-callout:none] hover:bg-muted active:bg-muted [&_svg]:size-3.5',
                    active
                      ? 'font-medium text-primary'
                      : 'text-muted-foreground'
                  )}
                  href={item.url}
                  key={item.url}
                  onClick={() => setTimeout(onClose, 0)}
                >
                  {'icon' in item ? item.icon : null}
                  {item.text}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
      <div className='flex items-center justify-between border-t border-dashed px-1.5 py-0.5'>
        {/* A touch narrower than square so the three-way theme switch still
            fits beside them on a 360px phone */}
        <div className='flex items-center'>
          {socials.map((social) => (
            <a
              aria-label={social.name}
              className='flex h-11 w-10 touch-manipulation items-center justify-center text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-3.5'
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
            aria-label='Open assistant'
            className='flex h-11 w-10 touch-manipulation items-center justify-center text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-3.5'
            onClick={onAssistantOpen}
            type='button'
          >
            <Icons.aiChat />
          </button>
          <ThemeToggle mode='light-dark-system' />
        </div>
      </div>
    </DialogPrimitive.Popup>
  )
}
