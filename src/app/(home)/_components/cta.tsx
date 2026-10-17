import Link from 'next/link'
import type React from 'react'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { GrainBackdrop } from '@/components/shader/grain-backdrop'
import { Button } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'

export default function CTA(): React.ReactElement {
  return (
    <Section className='relative isolate overflow-hidden'>
      <GrainBackdrop
        className='-z-10 opacity-60 dark:opacity-75'
        fade='bottom'
      />
      <div className='grid place-items-center gap-4 px-6 py-20 sm:px-16 sm:py-28'>
        <ViewAnimation delay={0.1}>
          <h2 className='typography-title text-balance text-center font-normal text-3xl tracking-tighter sm:text-5xl'>
            Let's work together
          </h2>
        </ViewAnimation>

        <div className='flex flex-col items-center gap-4'>
          <ViewAnimation delay={0.15}>
            <p className='typography-body text-pretty text-center text-muted-foreground sm:text-xl'>
              Have a question or an idea? Send me a message through the contact
              form or find me on social media.
            </p>
          </ViewAnimation>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <ViewAnimation delay={0.2}>
              <Button
                nativeButton={false}
                render={<Link href='/contact' />}
                size='lg'
              >
                Contact me{' '}
                <Icons.arrowRight
                  className='icon-arrow-button size-4'
                  data-icon='inline-end'
                />
              </Button>
            </ViewAnimation>
          </div>
        </div>
      </div>
    </Section>
  )
}
