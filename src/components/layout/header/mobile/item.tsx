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
        'relative flex size-8 touch-manipulation select-none items-center justify-center rounded-full transition-[color,background-color,scale] duration-150 ease-out-strong [-webkit-touch-callout:none] after:absolute after:-inset-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.96]',
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
