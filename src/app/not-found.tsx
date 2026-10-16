import type { Metadata } from 'next'
import Link from 'next/link'
import { AskSimbaButton } from '@/components/features/assistant/ask-simba-button'
import { SimbaSprite } from '@/components/features/not-found/simba-sprite'
import { Icons } from '@/components/icons/icons'
import { SiteShell } from '@/components/layout/site-shell'
import { buttonVariants } from '@/components/ui/button'
import { createMetadata } from '@/lib/metadata'

export default function NotFound() {
  return (
    <SiteShell>
      <section className='flex flex-1 flex-col border-border border-b border-dashed'>
        <div className='container relative mx-auto flex min-h-[28rem] flex-1 items-center justify-center overflow-hidden border-border border-x border-dashed px-4 pb-32 md:pb-0'>
          <div className='flex flex-col items-center gap-4 text-center'>
            <p className='font-mono text-muted-foreground text-xs uppercase tracking-widest'>
              404
            </p>
            <h1 className='text-balance font-semibold text-2xl tracking-tight'>
              Simba couldn't sniff this one out.
            </h1>
            <div className='mt-2 flex flex-wrap justify-center gap-2'>
              <Link className={buttonVariants()} href='/'>
                Go home
                <Icons.arrowRight className='icon-arrow-button size-4' />
              </Link>
              <AskSimbaButton />
            </div>
          </div>
          <div className='absolute -right-[43px] -bottom-3 md:hidden'>
            <SimbaSprite />
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

export const metadata: Metadata = createMetadata({
  description: "This page doesn't exist.",
  robots: { follow: false, index: false },
  title: 'Not Found',
})
