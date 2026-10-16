'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function GuestbookNote() {
  const pathname = usePathname()

  if (pathname === '/guestbook') {
    return <div aria-hidden className='screen-line-bottom h-8 bg-dashed' />
  }

  return (
    <div className='screen-line-bottom flex justify-center bg-dashed px-4 py-4'>
      <p className='-rotate-1 text-balance text-center font-hand text-muted-foreground text-xl'>
        since you read all the way down here, leave a proof you were here in the{' '}
        <Link
          className='text-primary underline decoration-wavy underline-offset-4 transition-colors hover:text-foreground'
          href='/guestbook'
        >
          guestbook
        </Link>
      </p>
    </div>
  )
}
