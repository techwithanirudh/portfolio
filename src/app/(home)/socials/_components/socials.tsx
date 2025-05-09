'use client';

import type { Social } from '@/app/layout.config';
import { InlineLink } from '@/components/inline-link';
import { Section } from '@/components/section';
import { cva } from 'class-variance-authority';

const Socials = ({ socials }: { socials: Social[] }) => (
  <Section className='relative w-full pb-4'>
    <div className='grid grid-cols-1 divide-x divide-y divide-dashed divide-border text-left sm:grid-cols-2'>
      {socials.map((social) => (
        <a
          key={social.url}
          className={'group flex flex-col justify-between gap-10 p-6 last:border-border last:border-b last:border-dashed hover:bg-card hover:bg-card/80 sm:gap-22 md:gap-34 lg:gap-46 [&_svg]:size-8 [&_svg]:stroke-1'}
          href={social.url}
          target='_blank'
          rel='noopener noreferrer'
        >
          {social.icon}
          <div className='flex flex-col '>
            <h3 className='text-xl tracking-tight transition-all'>
              {social.name}
            </h3>
            <p className='max-w-xs text-base text-muted-foreground transition-all'>
              {social.description}
            </p>
          </div>
        </a>
      ))}
    </div>
  </Section>
);

export default Socials;
