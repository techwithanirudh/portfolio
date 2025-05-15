import { Icons } from '@/components/icons/icons';
import { Section } from '@/components/section';
import { Button } from '@/components/ui/button';
import { env } from '@/env';
import Link from 'next/link';
import type React from 'react';
import Balancer from 'react-wrap-balancer';

export default function CTA(): React.ReactElement {
  return (
    <Section className='p-4'>
      <div className='grid gap-4 rounded-xl border bg-card items-center justify-center p-8 shadow-sm sm:p-16'>
        <h2 className='font-regular text-3xl text-center tracking-tighter sm:text-5xl max-w-xl'>
          <Balancer> Let's Collaborate</Balancer>
        </h2>
        <div className='flex flex-col items-center gap-4'>
          <p className='text-muted-foreground sm:text-xl max-w-2xl text-center'>
            <Balancer>
              Have questions or want to work together? Reach out through the
              contact form or find me on social platforms.
            </Balancer>
          </p>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <Button size='lg' className='group gap-4' asChild>
              <Link href={'/contact'}>
                Contact Me{' '}
                <Icons.arrowRight className='group-hover:-rotate-45 size-4 transition-transform' />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
