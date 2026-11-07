'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'
import { externalLinkProps } from '@/components/external-link'
import { Icons } from '@/components/icons/icons'
import { ThemeToggle } from '@/components/layout/header/theme-toggle'
import { linkItems, socials } from '@/constants/navigation'
import { pages } from '@/constants/pages'
import { isLinkItemActive } from '@/lib/is-active'
import { cn } from '@/lib/utils'

// Every tappable thing is a full grid cell, 48px tall. The focus ring sits
// inside the cell and stays square, so it never pokes past the dashed lines or
// gets clipped by the panel's rounded corners
const cellClassName =
  'flex h-12 touch-manipulation select-none items-center transition-colors [-webkit-touch-callout:none] hover:bg-muted focus-visible:rounded-none focus-visible:-outline-offset-4 active:bg-muted'

const menuItemClassName = cn(
  cellClassName,
  'gap-2 px-4 text-sm [&_svg]:size-3.5'
)

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
  const popupRef = useRef<HTMLDivElement>(null)
  const menuItems = [
    {
      active: 'url' as const,
      icon: <Icons.home />,
      text: pages.home.title,
      url: pages.home.path,
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
      className='dashed-stack fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-32 flex max-h-[calc(100dvh-7rem)] origin-bottom flex-col overflow-y-auto overscroll-contain rounded-xl border border-dashed bg-background outline-none transition-[opacity,scale] duration-200 ease-out-strong data-ending-style:scale-96 data-starting-style:scale-96 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-150 md:hidden'
      id={menuId}
      // Focus lands on the panel itself, so opening the menu doesn't light up
      // a ring on Home. Tab still walks into the links from here
      initialFocus={popupRef}
      ref={popupRef}
    >
      <nav className='dashed-stack flex flex-col'>
        {menuRows.map((row) => (
          <div
            className='grid grid-cols-2 divide-x divide-dashed'
            key={row.map((item) => item.url).join('-')}
          >
            {row.map((item) => {
              const active = isLinkItemActive(item, pathname)

              return (
                <Link
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    menuItemClassName,
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
      {/* Socials get a row of their own: next to Simba and the theme toggle
          they overflow a 360px screen */}
      <div className='grid grid-cols-5'>
        {socials.map((social) => (
          <a
            aria-label={social.name}
            className={cn(
              cellClassName,
              'justify-center text-muted-foreground hover:text-foreground [&_svg]:size-3.5'
            )}
            href={social.url}
            key={social.name}
            {...externalLinkProps}
          >
            {social.icon}
          </a>
        ))}
      </div>
      {/* Same two columns as the nav, so the middle line runs straight down
          and the theme cells split the right column into thirds */}
      <div className='grid grid-cols-2 divide-x divide-dashed'>
        <button
          className={cn(menuItemClassName, 'text-muted-foreground')}
          onClick={onAssistantOpen}
          type='button'
        >
          <Icons.pawPrint />
          Ask Simba
        </button>
        <ThemeToggle mode='light-dark-system' variant='grid' />
      </div>
    </DialogPrimitive.Popup>
  )
}
