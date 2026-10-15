'use client'

import Link from 'next/link'
import { type ReactNode, useEffect, useState } from 'react'
import { Icons } from '@/components/icons/icons'
import { cn } from '@/lib/utils'

const storageKey = (href: string) => `back-link:${href}`

interface BackLinkProps {
  children: ReactNode
  className?: string
  href: string
}

export const BackLink = ({ children, className, href }: BackLinkProps) => {
  const [target, setTarget] = useState(href)

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey(href))
      if (saved?.startsWith(href)) {
        setTarget(saved)
      }
    } catch {
      // Storage can be blocked, the plain list URL is fine then
    }
  }, [href])

  return (
    <Link
      className={cn(
        'group inline-flex items-center gap-1.5 font-mono text-muted-foreground text-xs transition-colors hover:text-foreground',
        className
      )}
      href={target}
    >
      <Icons.arrowLeft className='size-3.5 transition-transform group-hover:scale-125' />
      {children}
    </Link>
  )
}

export const RememberListPage = ({ href }: { href: string }) => {
  useEffect(() => {
    const remember = () => {
      try {
        sessionStorage.setItem(
          storageKey(href),
          window.location.pathname + window.location.search
        )
      } catch {
        // Storage can be blocked, BackLink falls back to the first page
      }
    }
    document.addEventListener('click', remember, { capture: true })
    return () =>
      document.removeEventListener('click', remember, { capture: true })
  }, [href])

  return null
}
