'use client'

import { NavigationMenu } from '@base-ui/react/navigation-menu'
import { cva } from 'class-variance-authority'
import Link from 'fumadocs-core/link'
import type { HomeLayoutProps } from 'fumadocs-ui/layouts/home'
import {
  type LinkItemType,
  type NavOptions,
  resolveLinkItems,
} from 'fumadocs-ui/layouts/shared'
import { useIsScrollTop } from 'fumadocs-ui/utils/use-is-scroll-top'
import { useLenis } from 'lenis/react'
import { usePathname } from 'next/navigation'
import {
  type ComponentProps,
  Fragment,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Icons } from '@/components/icons/icons'
import { buttonVariants } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

import { LinkItem } from './link-item'
import { SearchToggle } from './search-toggle'
import { ThemeToggle } from './theme-toggle'

const navItemVariants = cva('[&_svg]:size-4', {
  defaultVariants: {
    variant: 'main',
  },
  variants: {
    variant: {
      button: buttonVariants({
        className: 'gap-1.5',
        variant: 'secondary',
      }),
      icon: buttonVariants({
        size: 'icon',
        variant: 'ghost',
      }),
      main: 'relative inline-flex items-center gap-1 whitespace-nowrap p-2 text-muted-foreground transition-colors after:absolute after:inset-x-2 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground data-[active=true]:text-foreground data-[active=true]:after:scale-x-100',
    },
  },
})

const renderNavTitle = (
  nav: HomeLayoutProps['nav'],
  props: ComponentProps<'a'>
): ReactNode => {
  const title = nav?.title
  const href = nav?.url ?? '/'

  if (!title) {
    return null
  }

  if (typeof title === 'function') {
    return title({ href, ...props }) as ReactNode
  }

  return (
    <NavTitleLink href={href} {...props}>
      {title as ReactNode}
    </NavTitleLink>
  )
}

function NavTitleLink({ href, onClick, ...props }: ComponentProps<'a'>) {
  const pathname = usePathname()
  const lenis = useLenis()

  return (
    <Link
      href={href}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || pathname !== href) {
          return
        }
        event.preventDefault()
        if (lenis) {
          lenis.scrollTo(0)
        } else {
          window.scrollTo({ behavior: 'smooth', top: 0 })
        }
      }}
      {...props}
    />
  )
}

export const Header = ({
  nav = {},
  links,
  themeSwitch = {},
  searchToggle = {},
  className,
}: HomeLayoutProps & { className?: string }) => {
  const { navItems, menuItems } = useMemo(() => {
    const navItems: LinkItemType[] = []
    const menuItems: LinkItemType[] = []

    for (const item of resolveLinkItems({ links })) {
      switch (item.on ?? 'all') {
        case 'menu':
          menuItems.push(item)
          break
        case 'nav':
          navItems.push(item)
          break
        default:
          navItems.push(item)
          menuItems.push(item)
      }
    }

    return { menuItems, navItems }
  }, [links])

  return (
    <HeaderNavigationMenu
      className={className}
      menu={
        <div className='flex flex-col p-4 sm:flex-row sm:items-center sm:justify-end sm:gap-6'>
          {menuItems
            .filter((item) => !isSecondary(item))
            .map((item, i) => (
              <MobileNavigationMenuLinkItem
                className='lg:hidden'
                item={item}
                key={getItemKey(item, i)}
              />
            ))}
          <div className='-ms-1.5 flex flex-row items-center gap-2 max-sm:mt-2'>
            {menuItems.filter(isSecondary).map((item, i) => (
              <MobileNavigationMenuLinkItem
                className={cn(item.type === 'icon' && '-mx-1 first:ms-0')}
                item={item}
                key={getItemKey(item, i)}
              />
            ))}
            {themeSwitch.enabled !== false &&
              (themeSwitch.component ?? (
                <ThemeToggle mode={themeSwitch?.mode} />
              ))}
          </div>
        </div>
      }
      transparentMode={nav.transparentMode}
    >
      <div className='relative flex w-full items-center'>
        <div className='flex items-center gap-2'>
          <div>
            {renderNavTitle(nav, {
              className:
                'inline-flex items-center gap-2.5 font-semibold tracking-[-0.5px]',
            })}
          </div>
          {nav.children}
        </div>
        <ul className='absolute left-1/2 flex -translate-x-1/2 flex-row items-center gap-2 max-lg:hidden'>
          {navItems
            .filter((item) => !isSecondary(item))
            .map((item, i) => (
              <NavigationMenuLinkItem
                className='text-sm'
                item={item}
                key={getItemKey(item, i)}
              />
            ))}
        </ul>
        <div className='ml-auto flex flex-row items-center justify-end gap-1.5 max-lg:hidden'>
          <div>
            {searchToggle.enabled !== false &&
              (searchToggle.components?.lg ?? (
                <SearchToggle
                  className='-mx-1.5 text-muted-foreground hover:text-foreground'
                  hideIfDisabled
                />
              ))}
          </div>
          <div>
            {themeSwitch.enabled !== false &&
              (themeSwitch.component ?? (
                <ThemeToggle mode={themeSwitch?.mode} />
              ))}
          </div>
          <div>
            <ul className='flex flex-row items-center gap-2 empty:hidden'>
              {navItems.filter(isSecondary).map((item, i) => (
                <NavigationMenuLinkItem
                  className={cn(
                    item.type === 'icon' && '-mx-1 first:ms-0 last:me-0'
                  )}
                  item={item}
                  key={getItemKey(item, i)}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className='ms-auto -me-1.5 hidden flex-row items-center md:flex lg:hidden'>
        {searchToggle.enabled !== false &&
          (searchToggle.components?.sm ?? (
            <div>
              <SearchToggle hideIfDisabled size='icon' />
            </div>
          ))}
        <div>
          <CollapsibleTrigger
            aria-label='Toggle menu'
            className={buttonVariants({
              className: 'group',
              size: 'icon',
              variant: 'ghost',
            })}
          >
            <Icons.menu className='size-5.5 group-data-panel-open:hidden' />
            <Icons.close className='hidden size-5.5 group-data-panel-open:block' />
          </CollapsibleTrigger>
        </div>
      </div>
    </HeaderNavigationMenu>
  )
}

const HeaderNavigationMenu = ({
  transparentMode = 'none',
  menu,
  children,
  ...props
}: ComponentProps<'header'> & {
  menu: ReactNode
  transparentMode?: NavOptions['transparentMode']
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const isTop = useIsScrollTop({ enabled: transparentMode === 'top' }) ?? true
  const isTransparent =
    transparentMode === 'top' ? isTop : transparentMode === 'always'

  // A collapsible has no dismiss behavior of its own, so close the menu on
  // Escape or a press outside the header like the popup it replaces
  useEffect(() => {
    if (!menuOpen) {
      return
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <Collapsible
      onOpenChange={setMenuOpen}
      open={menuOpen}
      render={
        <header
          id='nd-nav'
          {...props}
          className={cn(
            'sticky top-0 z-30 box-content w-full border-b border-dashed bg-background/80 backdrop-blur-sm transition-colors max-md:hidden',
            props.className
          )}
          ref={headerRef}
        />
      }
    >
      <NavigationMenu.Root
        className={(state) =>
          cn(
            'transition-colors *:mx-auto *:max-w-(--fd-layout-width)',
            'container border-border border-dashed sm:border-x',
            (!isTransparent || menuOpen || state.open) && 'bg-background/80'
          )
        }
        render={<div />}
      >
        <NavigationMenu.List
          className='flex h-14 w-full items-center px-4 lg:px-6'
          ref={listRef}
          render={<nav aria-label='Main' />}
        >
          {children}
        </NavigationMenu.List>
        <CollapsibleContent
          className='h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-300 ease-out data-ending-style:h-0 data-starting-style:h-0 lg:hidden'
          onClick={(event) => {
            if ((event.target as Element).closest('a')) {
              setMenuOpen(false)
            }
          }}
        >
          {menu}
        </CollapsibleContent>
        <NavigationMenu.Portal>
          <NavigationMenu.Positioner
            anchor={listRef}
            className='z-40 h-(--positioner-height) w-(--anchor-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-300 ease-out data-instant:transition-none'
            collisionPadding={{ bottom: 5, top: 5 }}
            side='bottom'
          >
            <NavigationMenu.Popup className='relative h-(--popup-height) w-full rounded-b-xl border border-dashed bg-popover/80 text-popover-foreground shadow-lg backdrop-blur-md transition-[opacity,height] duration-300 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-150'>
              <NavigationMenu.Viewport className='relative size-full overflow-hidden' />
            </NavigationMenu.Popup>
          </NavigationMenu.Positioner>
        </NavigationMenu.Portal>
      </NavigationMenu.Root>
    </Collapsible>
  )
}

const getItemKey = (item: LinkItemType, index: number): string =>
  'url' in item && item.url ? item.url : index.toString()

const isSecondary = (item: LinkItemType): boolean =>
  ('secondary' in item && item.secondary === true) || item.type === 'icon'

const NavigationMenuLinkItem = ({
  item,
  ...props
}: {
  item: LinkItemType
  className?: string
}) => {
  if (item.type === 'custom') {
    return <div {...props}>{item.children}</div>
  }

  if (item.type === 'menu') {
    const children = item.items.map((child, j) => {
      if (child.type === 'custom') {
        return <Fragment key={j.toString()}>{child.children}</Fragment>
      }

      const {
        banner = child.icon ? (
          <div className='w-fit rounded-md border bg-muted p-1 [&_svg]:size-4'>
            {child.icon}
          </div>
        ) : null,
        ...rest
      } = child.menu ?? {}

      return (
        <NavigationMenu.Link
          key={child.url}
          render={
            <Link
              external={child.external}
              href={child.url}
              {...rest}
              className={cn(
                'flex flex-col gap-2 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent/80 hover:text-accent-foreground',
                rest.className
              )}
            >
              {rest.children ?? (
                <>
                  {banner}
                  <p className='font-medium text-base'>{child.text}</p>
                  <p className='text-muted-foreground text-sm empty:hidden'>
                    {child.description}
                  </p>
                </>
              )}
            </Link>
          }
        />
      )
    })

    return (
      <NavigationMenu.Item
        {...props}
        className={cn('list-none', props.className)}
      >
        <NavigationMenu.Trigger
          className={cn(
            navItemVariants(),
            'rounded-md data-popup-open:bg-accent/50'
          )}
        >
          {item.url ? (
            <Link external={item.external} href={item.url}>
              {item.text}
            </Link>
          ) : (
            item.text
          )}
        </NavigationMenu.Trigger>
        <NavigationMenu.Content className='grid h-full w-(--anchor-width) max-w-(--available-width) grid-cols-1 gap-2 p-4 transition-opacity duration-300 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 md:grid-cols-2 lg:grid-cols-3'>
          {children}
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    )
  }

  return (
    <NavigationMenu.Item
      {...props}
      className={cn('list-none', props.className)}
    >
      <NavigationMenu.Link
        render={
          <LinkItem
            aria-label={item.type === 'icon' ? item.label : undefined}
            className={cn(navItemVariants({ variant: item.type }))}
            item={item}
          >
            {item.type === 'icon' ? item.icon : item.text}
          </LinkItem>
        }
      />
    </NavigationMenu.Item>
  )
}

const MobileNavigationMenuLinkItem = ({
  item,
  ...props
}: {
  item: LinkItemType
  className?: string
}) => {
  if (item.type === 'custom') {
    return <div className={cn('grid', props.className)}>{item.children}</div>
  }

  if (item.type === 'menu') {
    const header = (
      <>
        {item.icon}
        {item.text}
      </>
    )

    return (
      <div className={cn('mb-4 flex flex-col', props.className)}>
        <p className='mb-1 text-muted-foreground text-sm'>
          {item.url ? (
            <Link external={item.external} href={item.url}>
              {header}
            </Link>
          ) : (
            header
          )}
        </p>
        {item.items.map((child, i) => (
          <MobileNavigationMenuLinkItem
            item={child}
            key={getItemKey(child, i)}
          />
        ))}
      </div>
    )
  }

  return (
    <LinkItem
      aria-label={item.type === 'icon' ? item.label : undefined}
      className={cn(
        {
          button: buttonVariants({
            className: 'gap-1.5 [&_svg]:size-4',
            variant: 'secondary',
          }),
          icon: buttonVariants({
            size: 'icon',
            variant: 'ghost',
          }),
          main: 'inline-flex items-center gap-2 py-1.5 transition-colors hover:text-popover-foreground/50 data-[active=true]:font-medium data-[active=true]:text-primary [&_svg]:size-4',
        }[item.type ?? 'main'],
        props.className
      )}
      item={item}
    >
      {item.icon}
      {item.type === 'icon' ? undefined : item.text}
    </LinkItem>
  )
}
