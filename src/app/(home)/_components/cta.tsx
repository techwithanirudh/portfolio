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
      <div className="grid gap-4 rounded-xl border bg-card relative flex flex-col items-center justify-center gap-6  p-8 shadow-sm sm:grid-cols-2 sm:gap-8 sm:p-16">
        <h2 className="mt-0 mb-4 font-semibold text-3xl tracking-tighter sm:text-5xl">
          <Balancer>Build your product roadmap at lightspeed</Balancer>
        </h2>
        <div className="flex flex-col items-start gap-4">
          <p className="text-muted-foreground sm:text-xl">
            <Balancer>
              Explore problems, ideate solutions, prioritize features and plan
              your roadmap with the help of AI.
            </Balancer>
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
      </div>
    </Section>
  );
}
