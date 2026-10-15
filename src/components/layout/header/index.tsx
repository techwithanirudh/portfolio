'use client'

import { usePathname } from 'fumadocs-core/framework'
// Layout adapted from chanhdai.com's SiteHeader (MIT, (c) Chanh Dai):
// https://github.com/ncdai/chanhdai.com
import Link from 'fumadocs-core/link'
import type { HomeLayoutProps } from 'fumadocs-ui/layouts/home'
import { type LinkItemType, resolveLinkItems } from 'fumadocs-ui/layouts/shared'
import { type ReactNode, useMemo } from 'react'
import { OIIA_TITLE, useOiiaMode } from '@/components/oiia'
import { isActive } from '@/lib/is-active'
import { cn } from '@/lib/utils'
import { SearchToggle } from './search-toggle'

const Divider = ({ className }: { className?: string }) => (
  <span
    aria-hidden
    className={cn('h-5 w-px shrink-0 self-center bg-line', className)}
  />
)

export const Header = ({
  nav = {},
  links,
  githubUrl,
  className,
}: HomeLayoutProps & { className?: string }) => {
  const { mode } = useOiiaMode()
  const pathname = usePathname()

  const { mainItems, iconItems } = useMemo(() => {
    const items = resolveLinkItems({ githubUrl, links }).filter(
      (item) => (item.on ?? 'all') !== 'menu'
    )
    return {
      iconItems: items.filter((item) => item.type === 'icon'),
      mainItems: items.filter(
        (item): item is Extract<LinkItemType, { url: string }> =>
          (item.type === undefined || item.type === 'main') && 'url' in item
      ),
    }
  }, [links, githubUrl])

  const title = (mode === 'oiia' ? OIIA_TITLE : nav.title) as ReactNode

  return (
    <header
      className={cn(
        'sticky top-0 z-40 max-w-screen overflow-x-clip bg-background/90 px-2 backdrop-blur-md',
        className
      )}
      id='nd-nav'
    >
      <div className='screen-line-top screen-line-bottom container mx-auto flex h-14 items-center gap-2 border-line border-x pr-2 pl-4 sm:gap-4'>
        <Link
          aria-label='Home'
          className='group/brand inline-flex items-center font-heading font-medium text-lg tracking-tighter'
          href={nav.url ?? '/'}
        >
          {title}
        </Link>

        <div className='flex-1' />

        <nav className='flex items-center gap-4 max-md:hidden'>
          {mainItems.map((item) => {
            const active =
              item.active !== 'none' &&
              isActive(item.url, pathname, item.active === 'nested-url')
            return (
              <Link
                aria-current={active ? 'page' : undefined}
                className='relative font-medium text-muted-foreground text-sm tracking-wide transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground hover:after:scale-x-100 aria-[current=page]:text-foreground aria-[current=page]:after:scale-x-100'
                external={item.external}
                href={item.url}
                key={item.url}
              >
                {item.text}
              </Link>
            )
          })}
        </nav>

        <div className='flex items-center'>
          <Divider className='mr-2 max-md:hidden' />
          {/* Phones search from the bottom pill */}
          <SearchToggle
            className='text-muted-foreground max-md:hidden'
            hideIfDisabled
          />
          {iconItems.map((item) =>
            'url' in item ? (
              <Link
                aria-label={item.label ?? item.text?.toString()}
                className='inline-flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4'
                external={item.external}
                href={item.url}
                key={item.url}
              >
                {item.icon}
              </Link>
            ) : null
          )}
        </div>
      </div>
    </header>
  )
}
