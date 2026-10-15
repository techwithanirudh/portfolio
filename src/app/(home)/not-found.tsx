import type { Metadata } from 'next'
import Link from 'next/link'
import { SimbaLoop } from '@/components/features/assistant/mascot/simba-loop'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionButton } from '@/components/layout/sections/button'
import Separator from '@/components/layout/sections/separator'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  description: 'The page you are looking for could not be found.',
  robots: { follow: false, index: false },
  title: 'Not Found',
})

const destinations = [
  { description: 'Who I am and what I do', href: '/about', label: 'About' },
  { description: 'Things I have built', href: '/projects', label: 'Projects' },
  { description: 'Notes and write ups', href: '/blog', label: 'Blog' },
  { description: 'Leave a note', href: '/guestbook', label: 'Guestbook' },
]

export default function NotFound() {
  return (
    <>
      <Section className='screen-line-top-none'>
        <div className='flex items-end justify-between gap-4 overflow-hidden px-4 pt-10'>
          <p className='font-heading font-medium text-[clamp(6rem,22vw,11rem)] leading-[0.8] tracking-tighter'>
            404
          </p>
          <SimbaLoop animation='Searching' className='mb-1 max-sm:hidden' />
        </div>
      </Section>
      <Section>
        <div className='flex flex-col gap-1 p-4'>
          <h1 className='font-heading font-medium text-2xl tracking-tight'>
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
        <ul className='grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0 [&>li:nth-child(-n+2)]:sm:border-line [&>li:nth-child(-n+2)]:sm:border-b sm:[&>li:nth-child(odd)]:border-line sm:[&>li:nth-child(odd)]:border-r'>
          {destinations.map((item) => (
            <li key={item.href}>
              <Link
                className='group flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-card'
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
        <SectionButton href='/'>Back home</SectionButton>
      </Section>
    </>
  )
}
