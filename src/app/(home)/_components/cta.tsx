import { Icons } from '@/components/icons/icons';
import { Section } from '@/components/section';
import { Button } from '@/components/ui/button';
import { env } from '@/env';
import Link from 'next/link';
import type React from 'react';
import Balancer from 'react-wrap-balancer';

export default function CTA(): React.ReactElement {
  return (
    <Section className='relative flex flex-col items-center justify-center gap-6 px-4 py-10 md:py-14 lg:px-6 lg:py-16'>
      <h2 className='max-w-xl font-regular text-3xl md:text-5xl'>
        Let's Collaborate
      </h2>

      <div className='flex flex-col justify-center items-center gap-6'>
        <p className='text-muted-foreground text-sm md:text-base max-w-2xl'>
          <Balancer>
            Have questions or want to work together? Reach out through the contact form or find me on social platforms.
          </Balancer>
        </p>
        <div className='flex flex-row gap-3'>
          <Button size='lg' className='group gap-4' asChild>
            <Link href={'/contact'}>
              <Icons.mail className='group-hover:-rotate-12 size-4 transition-transform' />
              Contact Me{' '}
            </Link>
          </Button>
          <Button
            size='lg'
            className='group gap-4 bg-transparent shadow-none'
            variant='outline'
            asChild
          >
            <Link href='/socials'>
              Socials{' '}
              <Icons.arrowRight className='group-hover:-rotate-45 size-4 transition-transform' />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
