import type { Metadata } from 'next'
import Link from 'next/link'
import { AskSimbaButton } from '@/components/features/not-found/ask-simba-button'
import { SimbaSprite } from '@/components/features/not-found/simba-sprite'
import { Icons } from '@/components/icons/icons'
import { SiteShell } from '@/components/layout/site-shell'
import { buttonVariants } from '@/components/ui/button'
import { linkItems } from '@/constants/navigation'
import { createMetadata } from '@/lib/metadata'
import { getSortedByDatePosts } from '@/lib/source'

const chipClass =
  'inline-flex items-center gap-2 rounded-full border border-border border-dashed px-3 py-1.5 text-muted-foreground text-sm transition-colors hover:border-solid hover:text-foreground'

export default function NotFound() {
  const latest = getSortedByDatePosts()[0]

  return (
    <SiteShell>
      <div className='container mx-auto flex flex-1 items-center justify-center border-border border-x border-dashed px-4 py-16'>
        <div className='flex w-full max-w-lg flex-col items-center gap-8 text-center'>
          <div className='flex flex-col items-center gap-3'>
            <div className='relative rounded-2xl border border-border bg-card px-5 py-4 text-sm after:absolute after:top-full after:left-1/2 after:size-3 after:-translate-x-1/2 after:-translate-y-1.5 after:rotate-45 after:border-border after:border-r after:border-b after:bg-card'>
              <span className='font-medium text-foreground'>woof!</span>{' '}
              <span className='text-muted-foreground'>
                i sniffed everywhere, but that page isn't here.
              </span>
            </div>
            <SimbaSprite />
          </div>

          <div className='flex flex-col gap-1'>
            <p className='font-mono text-muted-foreground text-xs uppercase tracking-widest'>
              404
            </p>
            <h1 className='text-balance font-semibold text-2xl tracking-tight'>
              This page could not be found.
            </h1>
          </div>

          <div className='flex flex-wrap justify-center gap-2'>
            <Link className={buttonVariants()} href='/'>
              Go Home
              <Icons.arrowRight className='icon-arrow-button size-4' />
            </Link>
            <AskSimbaButton />
          </div>

          <ul className='flex flex-wrap justify-center gap-2'>
            {linkItems.map((item) =>
              item.type === undefined || item.type === 'main' ? (
                <li key={item.url}>
                  <Link className={chipClass} href={item.url}>
                    {item.text}
                  </Link>
                </li>
              ) : null
            )}
            {latest ? (
              <li>
                <Link className={chipClass} href={latest.url}>
                  Latest: {latest.data.title}
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </SiteShell>
  )
}

export const metadata: Metadata = createMetadata({
  description: 'The page you are looking for could not be found.',
  title: 'Not Found',
})
