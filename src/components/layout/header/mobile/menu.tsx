'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { externalLinkProps } from '@/components/external-link'
import { Icons } from '@/components/icons/icons'
import { ThemeToggle } from '@/components/layout/header/theme-toggle'
import { linkItems, socials } from '@/constants/navigation'
import { isLinkItemActive } from '@/lib/is-active'
import { cn } from '@/lib/utils'

const footerIconClassName =
  'flex h-11 w-10 touch-manipulation items-center justify-center text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-3.5'

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
  // TODO(slopradar): duplication: a hand-written Home item ('Home', '/') is prepended here and again in footer/links.tsx and mobile/pill.tsx (x3) while constants/pages has pages.home; build it once from pages.home next to linkItems in constants/navigation
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
      className='fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-32 max-h-[calc(100dvh-7rem)] origin-bottom overflow-y-auto overscroll-contain rounded-xl border border-dashed bg-background outline-none transition-[opacity,scale] duration-200 ease-out-strong data-ending-style:scale-96 data-starting-style:scale-96 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-150 md:hidden'
      id={menuId}
    >
      <nav className='dashed-stack flex flex-col'>
        {menuRows.map((row) => (
          <div
            className='grid grid-cols-2 divide-x divide-dashed divide-border'
            key={row.map((item) => item.url).join('-')}
          >
            {row.map((item) => {
              const active = isLinkItemActive(item, pathname)

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
                  // TODO(slopradar): magic-deferral: setTimeout(0) defers the close with no stated reason, say why (navigation must run first) or call onClose directly
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
        <div className='flex items-center'>
          {socials.map((social) => (
            <a
              aria-label={social.name}
              className={footerIconClassName}
              href={social.url}
              key={social.name}
              {...externalLinkProps}
            >
              {social.icon}
            </a>
          ))}
        </div>
        <div className='flex items-center gap-1'>
          <button
            aria-label='Open assistant'
            className={footerIconClassName}
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
