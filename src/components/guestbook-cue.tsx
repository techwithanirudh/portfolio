'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { Icons } from '@/components/icons/icons'
import { cn } from '@/lib/utils'

const GUESTBOOK_PATH = '/guestbook'

const GuestbookLink = ({ children }: { children?: ReactNode }) => (
  <Link
    className='group/guestbook inline-flex items-center gap-1 font-medium text-foreground underline decoration-muted-foreground/60 decoration-dashed underline-offset-4 transition-colors hover:decoration-primary'
    href={GUESTBOOK_PATH}
  >
    {children ?? 'guestbook'}
    <Icons.arrowRight className='icon-arrow-button size-3.5' />
  </Link>
)

export function GuestbookCue({
  before,
  className,
  children,
}: {
  before: ReactNode
  className?: string
  children?: ReactNode
}) {
  const pathname = usePathname()

  if (pathname.startsWith(GUESTBOOK_PATH)) {
    return null
  }

  return (
    <p
      className={cn(
        'text-pretty text-muted-foreground text-sm leading-relaxed',
        className
      )}
    >
      {before} <GuestbookLink>{children}</GuestbookLink>
    </p>
  )
}

export function GuestbookBand({
  before,
  className,
}: {
  before: ReactNode
  className?: string
}) {
  const pathname = usePathname()

  if (pathname.startsWith(GUESTBOOK_PATH)) {
    return null
  }

  return (
    <div
      className={cn(
        'flex justify-center border-border border-b border-dashed px-4 py-10 text-center sm:py-14',
        className
      )}
    >
      <GuestbookCue before={before} className='max-w-md text-base sm:text-lg' />
    </div>
  )
}
