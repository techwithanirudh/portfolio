'use client'

import { usePathname } from 'fumadocs-core/framework'
import Link from 'fumadocs-core/link'
import type { ComponentProps, ReactNode } from 'react'
import { isActive } from '@/lib/is-active'

interface Filterable {
  /**
   * Restrict where the item is displayed
   *
   * @defaultValue 'all'
   */
  on?: 'menu' | 'nav' | 'all'
}

interface WithHref {
  /**
   * When the item is marked as active
   *
   * @defaultValue 'url'
   */
  active?: 'url' | 'nested-url' | 'none'
  external?: boolean
  url: string
}

export interface MainItemType extends WithHref, Filterable {
  description?: ReactNode
  icon?: ReactNode
  text: ReactNode
  type?: 'main'
}

export interface IconItemType extends WithHref, Filterable {
  icon: ReactNode
  /**
   * `aria-label` of icon button
   */
  label?: string
  /**
   * @defaultValue true
   */
  secondary?: boolean
  text: ReactNode
  type: 'icon'
}

export interface ButtonItemType extends WithHref, Filterable {
  icon?: ReactNode
  /**
   * @defaultValue false
   */
  secondary?: boolean
  text: ReactNode
  type: 'button'
}

export interface MenuItemType extends Partial<WithHref>, Filterable {
  icon?: ReactNode

  items: (
    | (MainItemType & {
        /**
         * Options when displayed on navigation menu
         */
        menu?: ComponentProps<'a'> & {
          banner?: ReactNode
        }
      })
    | CustomItemType
  )[]

  /**
   * @defaultValue false
   */
  secondary?: boolean
  text: ReactNode
  type: 'menu'
}

export interface CustomItemType extends Filterable {
  children: ReactNode
  /**
   * @defaultValue false
   */
  secondary?: boolean
  type: 'custom'
}

export type LinkItemType =
  | MainItemType
  | IconItemType
  | ButtonItemType
  | MenuItemType
  | CustomItemType

export const LinkItem = ({
  ref,
  item,
  ...props
}: Omit<ComponentProps<'a'>, 'href'> & { item: WithHref }) => {
  const pathname = usePathname()
  const activeType = item.active ?? 'url'
  const active =
    activeType !== 'none' &&
    isActive(item.url, pathname, activeType === 'nested-url')

  return (
    <Link
      external={item.external}
      href={item.url}
      ref={ref}
      {...props}
      data-active={active}
    >
      {props.children}
    </Link>
  )
}
