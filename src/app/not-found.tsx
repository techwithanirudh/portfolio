import type { Metadata } from 'next'
import Link from 'next/link'
import { SimbaLoop } from '@/components/features/not-found/simba-loop'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionMoreLink } from '@/components/layout/sections/more-link'
import Separator from '@/components/layout/sections/separator'
import { SiteShell } from '@/components/layout/site-shell'
import { createMetadata } from '@/lib/metadata'

// Ported from the an1rudh rebrand prototype (PR #108)
const destinations = [
  { description: 'Who I am and what I do', href: '/about', label: 'About' },
  { description: 'Things I have built', href: '/projects', label: 'Projects' },
  { description: 'Notes and write ups', href: '/blog', label: 'Blog' },
  { description: 'Leave a note', href: '/guestbook', label: 'Guestbook' },
]

export default function NotFound() {
  return (
    <SiteShell>
      {/* Same full width dividers the (home) layout gives its sections */}
      <div className='contents divide-y divide-dashed divide-border [&>:last-child]:border-border [&>:last-child]:border-b [&>:last-child]:border-dashed'>
        <Section>
          {/* Simba is sized in em so he stays as tall as the digits */}
          <div className='flex items-end justify-between gap-4 overflow-hidden px-4 py-10 text-[clamp(6rem,22vw,11rem)] sm:px-6 sm:pt-9 sm:pb-12'>
            <p className='font-medium leading-[0.8] tracking-tighter'>404</p>
            <SimbaLoop
              animation='Searching'
              className='shrink-0 translate-y-[0.04em] max-sm:hidden'
              size='0.88em'
            />
          </div>
        </Section>
        <Section>
          <div className='flex flex-col gap-1 px-4 py-5 sm:px-6'>
            <h1 className='font-medium text-2xl tracking-tight'>
              Page not found
            </h1>
            <p className='text-muted-foreground'>
              Simba&apos;s been sniffing around for it. It moved, never existed,
              or he buried it somewhere.
            </p>
          </div>
        </Section>
        <Separator />
        <Section>
          <ul className='grid divide-y divide-dashed divide-border sm:grid-cols-2 sm:divide-y-0 sm:[&>li:nth-child(-n+2)]:border-border sm:[&>li:nth-child(-n+2)]:border-b sm:[&>li:nth-child(-n+2)]:border-dashed sm:[&>li:nth-child(odd)]:border-border sm:[&>li:nth-child(odd)]:border-r sm:[&>li:nth-child(odd)]:border-dashed'>
            {destinations.map((item) => (
              <li key={item.href}>
                <Link
                  className='group flex items-center justify-between gap-4 px-4 py-5 transition-colors hover:bg-card sm:px-6'
                  href={item.href}
                >
                  <span className='flex flex-col'>
                    <span className='font-medium transition-colors group-hover:text-primary'>
                      {item.label}
                    </span>
                    <span className='text-muted-foreground text-sm'>
                      {item.description}
                    </span>
                  </span>
                  <Icons.arrowRight className='size-4 shrink-0 text-muted-foreground transition-[rotate,color] duration-300 group-hover:-rotate-45 group-hover:text-foreground' />
                </Link>
              </li>
            ))}
          </ul>
          <SectionMoreLink href='/'>Back home</SectionMoreLink>
        </Section>
      </div>
    </SiteShell>
  )
}

export const metadata: Metadata = createMetadata({
  description: "This page doesn't exist.",
  robots: { follow: false, index: false },
  title: 'Not Found',
})
