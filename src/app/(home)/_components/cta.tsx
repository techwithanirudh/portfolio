import Link from 'next/link'
import type React from 'react'
import { GuestbookCue } from '@/components/guestbook-cue'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { Button } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'

export default function CTA(): React.ReactElement {
  return (
    <Section className='p-4'>
      <div className='grid place-items-center gap-4 rounded-xl border bg-card p-8 shadow-sm sm:p-16'>
        <ViewAnimation
          delay={0.1}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <h2 className='typography-title text-balance text-center font-regular text-3xl tracking-tighter sm:text-5xl'>
            Let's Collaborate
          </h2>
        </ViewAnimation>

        <div className='flex flex-col items-center gap-4'>
          <ViewAnimation
            delay={0.15}
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <p className='typography-body text-pretty text-center text-muted-foreground sm:text-xl'>
              Have a question or an idea? Send me a message through the contact
              form or find me on social media.
            </p>
          </ViewAnimation>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <ViewAnimation
              delay={0.2}
              initial={{ opacity: 0, translateY: -6 }}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <Button
                nativeButton={false}
                render={<Link href='/contact' />}
                size='lg'
              >
                Contact Me{' '}
                <Icons.arrowRight className='icon-arrow-button size-4' />
              </Button>
            </ViewAnimation>
          </div>
          <ViewAnimation
            delay={0.25}
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <GuestbookCue before='Not ready to write? Just say hi in the' />
          </ViewAnimation>
        </div>
      </div>
    </Section>
  )
}
