'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { cn } from '@/lib/utils'

const GUESTBOOK_PATH = '/guestbook'

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
    <Section
      className={cn(
        'flex justify-center bg-dashed px-4 py-6 text-center sm:py-8',
        className
      )}
      sectionClassName='border-border border-b border-dashed'
    >
      <p className='flex -rotate-1 items-center gap-3 text-balance bg-background px-4 py-1 font-hand text-foreground/75 text-xl leading-snug sm:text-2xl'>
        <Icons.pawPrint
          aria-hidden
          className='size-5 shrink-0 text-primary max-sm:hidden'
        />
        <span>
          {before}{' '}
          <Link
            className='text-primary underline decoration-2 decoration-wavy underline-offset-6 transition-colors hover:text-foreground'
            href={GUESTBOOK_PATH}
          >
            guestbook
          </Link>
        </span>
        <Icons.pawPrint
          aria-hidden
          className='size-5 shrink-0 text-primary max-sm:hidden'
        />
      </p>
    </Section>
  )
}
