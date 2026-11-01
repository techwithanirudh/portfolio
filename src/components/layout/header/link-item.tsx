'use client'

import { usePathname } from 'fumadocs-core/framework'
import Link from 'fumadocs-core/link'
import type { LinkItemType } from 'fumadocs-ui/layouts/shared'
import type { ComponentProps } from 'react'
import { isLinkItemActive } from '@/lib/is-active'

type WithHref = Extract<LinkItemType, { url: string }>

export const LinkItem = ({
  ref,
  item,
  ...props
}: Omit<ComponentProps<'a'>, 'href'> & { item: WithHref }) => {
  const pathname = usePathname()
  const active = isLinkItemActive(item, pathname)

  return (
    <Link
      external={item.external}
      href={item.url}
      ref={ref}
      {...props}
      data-active={active}
    />
  )
}
