import Link from 'next/link'
import type { ReactNode } from 'react'
import { Icons } from '@/components/icons/icons'
import { cn } from '@/lib/utils'

interface BackLinkProps {
  children: ReactNode
  className?: string
  href: string
}

// Mono "← Section" link at the top of detail pages
export const BackLink = ({ children, className, href }: BackLinkProps) => (
  <Link
    className={cn(
      'group inline-flex items-center gap-1.5 font-mono text-muted-foreground text-xs transition-colors hover:text-foreground',
      className
    )}
    href={href}
  >
    <Icons.arrowLeft className='size-3.5 transition-transform group-hover:scale-125' />
    {children}
  </Link>
)
