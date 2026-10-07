import type { Metadata } from 'next'
import Link from 'next/link'
import { AskSimbaButton } from '@/components/features/not-found/ask-simba-button'
import { SimbaSprite } from '@/components/features/not-found/simba-sprite'
import { Icons } from '@/components/icons/icons'
import { SiteShell } from '@/components/layout/site-shell'
import { buttonVariants } from '@/components/ui/button'
import { createMetadata } from '@/lib/metadata'

export default function NotFound() {
  return (
    <SiteShell>
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
              Go Home
              <Icons.arrowRight className='icon-arrow-button size-4' />
            </Link>
            <AskSimbaButton />
          </div>
        </div>
        {/* Rover lives in the corner on md+; on mobile the mascot doesn't load, so he sits on the bottom edge instead */}
        <div className='absolute -right-12 bottom-0 md:hidden'>
          <SimbaSprite />
        </div>
      </div>
    </SiteShell>
  )
}

export const metadata: Metadata = createMetadata({
  description: 'The page you are looking for could not be found.',
  title: 'Not Found',
})
