import Link from 'next/link'
import type React from 'react'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/section'
import { SectionHeader } from '@/components/sections/section-header'
import { Button } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'

export default function CTA(): React.ReactElement {
  return (
    <Section className='p-4'>
      <div className='grid place-items-center gap-4 rounded-xl border bg-card p-8 sm:p-16'>
        <SectionHeader
          align='center'
          description='Have questions or want to connect? Reach out through the contact form or find me on social platforms.'
          descriptionClassName='sm:text-xl'
          size='large'
          title="Let's Collaborate"
        />
        <ViewAnimation
          blur={false}
          delay={0.2}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <Button asChild className='group gap-4' size='lg'>
            <Link href='/contact'>
              Contact Me{' '}
              <Icons.arrowRight className='size-4 transition-transform group-hover:-rotate-45' />
            </Link>
          </Button>
        </ViewAnimation>
      </div>
    </Section>
  )
}
