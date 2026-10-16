'use client'

import { NavigationMenu } from '@base-ui/react/navigation-menu'
import { cva } from 'class-variance-authority'
import Link from 'fumadocs-core/link'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import type { HomeLayoutProps } from 'fumadocs-ui/layouts/home'
import {
  type LinkItemType,
  type NavOptions,
  resolveLinkItems,
} from 'fumadocs-ui/layouts/shared'
import { useIsScrollTop } from 'fumadocs-ui/utils/use-is-scroll-top'
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ViewAnimation } from '@/components/view-animation'
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
        color: 'secondary',
      }),
      icon: buttonVariants({
        color: 'ghost',
        size: 'icon',
      }),
      // The active page is underlined; hover only lifts the text color
      main: 'relative inline-flex items-center gap-1 whitespace-nowrap p-2 text-fd-muted-foreground transition-colors after:absolute after:inset-x-2 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-fd-primary after:transition-transform hover:text-fd-foreground data-[active=true]:text-fd-foreground data-[active=true]:after:scale-x-100',
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
    <Link href={href} {...props}>
      {title as ReactNode}
    </Link>
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
        <div className='flex flex-col p-4 sm:flex-row sm:items-center sm:justify-end'>
          {menuItems
            .filter((item) => !isSecondary(item))
            .map((item, i) => (
              <MobileNavigationMenuLinkItem
                className='lg:hidden'
                item={item}
                key={i.toString()}
              />
            ))}
          <div className='-ms-1.5 flex flex-row items-center gap-2 max-sm:mt-2'>
            {menuItems.filter(isSecondary).map((item, i) => (
              <MobileNavigationMenuLinkItem
                className={cn(item.type === 'icon' && '-mx-1 first:ms-0')}
                item={item}
                key={i.toString()}
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
          <ViewAnimation>
            {renderNavTitle(nav, {
              className:
                'inline-flex items-center gap-2.5 font-semibold tracking-[-0.5px]',
            })}
          </ViewAnimation>
          {nav.children}
        </div>
        <ul className='absolute left-1/2 flex -translate-x-1/2 flex-row items-center gap-2 max-lg:hidden'>
          {navItems
            .filter((item) => !isSecondary(item))
            .map((item, i) => (
              <ViewAnimation delay={0.05 * i} key={i.toString()}>
                <NavigationMenuLinkItem className='text-sm' item={item} />
              </ViewAnimation>
            ))}
        </ul>
        <div className='ml-auto flex flex-row items-center justify-end gap-1.5 max-lg:hidden'>
          <ViewAnimation delay={0.15}>
            {searchToggle.enabled !== false &&
              (searchToggle.components?.lg ?? <SearchToggle hideIfDisabled />)}
          </ViewAnimation>
          <ViewAnimation delay={0.15}>
            {themeSwitch.enabled !== false &&
              (themeSwitch.component ?? (
                <ThemeToggle mode={themeSwitch?.mode} />
              ))}
          </ViewAnimation>
          <ViewAnimation delay={0.15}>
            <ul className='flex flex-row items-center gap-2 empty:hidden'>
              {navItems.filter(isSecondary).map((item, i) => (
                <NavigationMenuLinkItem
                  className={cn(
                    item.type === 'icon' && '-mx-1 first:ms-0 last:me-0'
                  )}
                  item={item}
                  key={i.toString()}
                />
              ))}
            </ul>
          </ViewAnimation>
        </div>
      </div>
      <div className='ms-auto -me-1.5 hidden flex-row items-center md:flex lg:hidden'>
        {searchToggle.enabled !== false &&
          (searchToggle.components?.sm ?? (
            <ViewAnimation delay={0.1}>
              <SearchToggle className='p-2' hideIfDisabled />
            </ViewAnimation>
          ))}
        <ViewAnimation delay={0.15}>
          <CollapsibleTrigger
            aria-label='Toggle Menu'
            className={cn(
              buttonVariants({
                className: 'group [&_svg]:size-5.5',
                color: 'ghost',
                size: 'icon',
              })
            )}
          >
            <Icons.menu className='transition-all duration-300 group-data-panel-open:hidden' />
            <Icons.close className='hidden transition-all duration-300 group-data-panel-open:block' />
          </CollapsibleTrigger>
        </ViewAnimation>
      </div>
    </HeaderNavigationMenu>
  )
}

// The tablet menu is a collapsible that pushes the page down under the sticky
// header, while dropdown items (`type: 'menu'`) use Base UI's navigation menu
// popup anchored to the bar
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
            'sticky top-0 z-30 box-content w-full border-b border-dashed bg-fd-background/80 backdrop-blur-lg transition-colors max-md:hidden',
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
            (!isTransparent || menuOpen || state.open) && 'bg-fd-background/80'
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
          // Following a link closes the menu
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
            <NavigationMenu.Popup className='relative h-(--popup-height) w-full rounded-b-xl border border-dashed bg-fd-popover/80 text-fd-popover-foreground shadow-lg backdrop-blur-md transition-[opacity,height] duration-300 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-150'>
              <NavigationMenu.Viewport className='relative size-full overflow-hidden' />
            </NavigationMenu.Popup>
          </NavigationMenu.Positioner>
        </NavigationMenu.Portal>
      </NavigationMenu.Root>
    </Collapsible>
  )
}

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
          <div className='w-fit rounded-md border bg-fd-muted p-1 [&_svg]:size-4'>
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
                'flex flex-col gap-2 rounded-lg border border-border bg-fd-card p-3 transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground',
                rest.className
              )}
            >
              {rest.children ?? (
                <>
                  {banner}
                  <p className='font-medium text-base'>{child.text}</p>
                  <p className='text-fd-muted-foreground text-sm empty:hidden'>
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
            'rounded-md data-popup-open:bg-fd-accent/50'
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
        <p className='mb-1 text-fd-muted-foreground text-sm'>
          {item.url ? (
            <Link external={item.external} href={item.url}>
              {header}
            </Link>
          ) : (
            header
          )}
        </p>
        {item.items.map((child, i) => (
          <MobileNavigationMenuLinkItem item={child} key={i.toString()} />
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
            color: 'secondary',
          }),
          icon: buttonVariants({
            color: 'ghost',
            size: 'icon',
          }),
          main: 'inline-flex items-center gap-2 py-1.5 transition-colors hover:text-fd-popover-foreground/50 data-[active=true]:font-medium data-[active=true]:text-fd-primary [&_svg]:size-4',
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
