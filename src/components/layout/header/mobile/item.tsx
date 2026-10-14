'use client'

import { motion } from 'motion/react'
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
        'relative flex size-8 items-center justify-center rounded-xl transition-[color,scale] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-90',
        active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      )}
      href={href}
    >
      {active && (
        // The highlight slides between tabs instead of blinking
        <motion.span
          className='absolute inset-0 rounded-xl bg-primary/10'
          layoutId='mobile-nav-active'
          transition={{ bounce: 0.2, duration: 0.35, type: 'spring' }}
        />
      )}
      <span className='relative'>{icon}</span>
    </Link>
  )
}
