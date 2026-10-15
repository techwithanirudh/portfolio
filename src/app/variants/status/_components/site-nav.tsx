'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { navItems } from '../_lib/routes'

export function SiteNav() {
  const pathname = usePathname()
  return (
    <nav aria-label='Variant' className='flex items-center gap-0.5'>
      {navItems.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative rounded-lg px-2.5 py-1.5 text-[13px] transition-colors sm:px-3',
              active
                ? 'bg-[var(--panel-raised)] font-medium text-[var(--text)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            )}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
