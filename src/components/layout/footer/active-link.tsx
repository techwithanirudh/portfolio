'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'
import { isActive } from '@/lib/is-active'
import { cn } from '@/lib/utils'

export const ActiveLink = ({
  href,
  children,
  className,
  ...props
}: ComponentProps<typeof Link> & { href: string }) => {
  const pathname = usePathname()
  const active = isActive(href, pathname, { nested: false })

  return (
    <Link
      className={cn(
        'text-muted-foreground text-sm transition-colors',
        'hover:text-foreground',
        active && 'font-medium text-foreground',
        className
      )}
      href={href}
      {...props}
    >
      {children}
    </Link>
  )
}
