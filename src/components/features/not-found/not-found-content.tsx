import Link from 'next/link'
import { SimbaLoop } from '@/components/features/not-found/simba-loop'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { TitleDot } from '@/components/layout/sections/hero'
import Separator from '@/components/layout/sections/separator'
import { Button } from '@/components/ui/button'
import { pages } from '@/constants/pages'

const destinations = [
  { description: 'Who I am and what I do', page: pages.about },
  { description: 'Things I have built', page: pages.projects },
  { description: 'Notes and write ups', page: pages.blog },
  { description: 'Leave a note', page: pages.guestbook },
].map(({ description, page }) => ({
  description,
  href: page.path,
  label: page.title,
}))

export function NotFoundContent() {
  return (
    <>
      <Section>
        <div className='flex items-end justify-between gap-6 overflow-hidden px-4 pt-10 pb-8 sm:px-6 sm:pt-14 sm:pb-10'>
          <div className='flex flex-col gap-3'>
            <p className='font-mono text-muted-foreground text-xs uppercase tracking-widest'>
              404
            </p>
            <h1 className='text-balance font-normal text-4xl leading-tight tracking-tighter md:text-5xl'>
              Simba ate this page
              <TitleDot />
            </h1>
          </div>
          <SimbaLoop
            animation='Sniffing'
            className='shrink-0 translate-y-2'
            size='clamp(5.5rem,16vw,9rem)'
          />
        </div>
      </Section>
      <Section>
        <div className='flex flex-col items-start gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
          <p className='text-pretty text-muted-foreground'>
            He&apos;s still sniffing around for it. The home page is safe.
          </p>
          <Button
            className='shrink-0'
            nativeButton={false}
            render={<Link href='/' />}
          >
            Take me home
            <Icons.arrowRight
              className='icon-arrow-button size-4'
              data-icon='inline-end'
            />
          </Button>
        </div>
      </Section>
      <Separator />
      <Section>
        <ul className='dashed-grid sm:dashed-grid-2 grid sm:grid-cols-2'>
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
      </Section>
    </>
  )
}
