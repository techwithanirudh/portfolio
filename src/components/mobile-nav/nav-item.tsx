'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isActive } from '@/lib/is-active'
import { cn } from '@/lib/utils'

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
  const active = isActive(href, pathname, nested)

  return (
    <Link
      aria-current={active ? 'page' : undefined}
      aria-label={label}
      className={cn(
        'flex size-8 items-center justify-center rounded-full transition-colors',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:text-foreground'
      )}
      href={href}
    >
      {icon}
    </Link>
  )
}
