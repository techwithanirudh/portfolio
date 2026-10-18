'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'

const GUESTBOOK_PATH = '/guestbook'

export function GuestbookBand() {
  // TODO(slopradar): misplaced-logic: a client component reads the pathname only to render on '/', render the band from the home page (server) and drop usePathname, 'use client' and the null branch (check it still sits above the footer); file guestbook-cue vs export GuestbookBand also disagree
  const pathname = usePathname()

  if (pathname !== '/') {
    return null
  }

  return (
    <Section
      className='flex justify-center bg-dashed px-4 py-6 text-center sm:py-8'
      sectionClassName='border-border border-b border-dashed'
    >
      <p className='flex items-center gap-3 text-balance font-hand text-foreground/75 text-xl leading-snug sm:text-2xl'>
        <Icons.pawPrint
          aria-hidden
          className='size-5 shrink-0 text-primary max-sm:hidden'
        />
        <span>
          since you read all the way down, leave proof you were here in the{' '}
          <Link
            className='text-primary underline decoration-2 decoration-wavy underline-offset-6 transition-colors hover:text-foreground'
            href={GUESTBOOK_PATH}
          >
            guestbook
          </Link>
        </span>
        <Icons.pawPrint
          aria-hidden
          className='size-5 shrink-0 -scale-x-100 text-primary max-sm:hidden'
        />
      </p>
    </Section>
  )
}
