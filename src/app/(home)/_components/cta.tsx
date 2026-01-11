import Link from 'next/link';
import type React from 'react';
import Balancer from 'react-wrap-balancer';
import { Icons } from '@/components/icons/icons';
import { Section } from '@/components/section';
import { Button } from '@/components/ui/button';
import { ViewAnimation } from '@/components/view-animation';

export default function CTA(): React.ReactElement {
  return (
    <Section className='p-4'>
      <div className='grid items-center justify-center gap-4 rounded-xl border bg-card p-8 shadow-sm sm:p-16'>
        <ViewAnimation
          initial={{ opacity: 0, translateY: -8 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          delay={0.4}
        >
          <h2 className='max-w-xl text-center font-regular text-3xl tracking-tighter sm:text-5xl'>
            Let's Collaborate
          </h2>
        </ViewAnimation>

        <div className='flex flex-col items-center gap-4'>
          <ViewAnimation
            initial={{ opacity: 0, translateY: -8 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            delay={0.6}
          >
            <p className='max-w-2xl text-center text-muted-foreground sm:text-xl'>
              <Balancer>
                Have questions or want to work together? Reach out through the
                contact form or find me on social platforms.
              </Balancer>
            </p>
          </ViewAnimation>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <ViewAnimation
              initial={{ opacity: 0, translateY: -8 }}
              whileInView={{ opacity: 1, translateY: 0 }}
              delay={1}
            >
              <Button size='lg' className='group gap-4' asChild>
                <Link href={'/contact'}>
                  Contact Me{' '}
                  <Icons.arrowRight className='group-hover:-rotate-45 size-4 transition-transform' />
                </Link>
              </Button>
            </ViewAnimation>
          </div>
        </div>
      </div>
    </Section>
  );
}
