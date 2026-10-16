'use client'

import { usePathname } from 'fumadocs-core/framework'
import Link from 'fumadocs-core/link'
import type { ComponentProps } from 'react'
import { isActive } from '@/lib/is-active'

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
