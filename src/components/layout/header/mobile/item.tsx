'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { pillItemVariants } from '@/components/layout/header/mobile/pill-item-variants'
import { isActive } from '@/lib/is-active'

export function NavItem({
  href,
  icon,
  label,
  nested,
}: {
  href: string
  icon: React.ReactNode
  label: string
  nested?: boolean
}) {
  const pathname = usePathname()
  const active = isActive(href, pathname, { nested })

  return (
    <Link
      aria-current={active ? 'page' : undefined}
      aria-label={label}
      className={pillItemVariants({
        active,
        className: '[-webkit-touch-callout:none]',
      })}
      href={href}
    >
      {icon}
    </Link>
  )
}
