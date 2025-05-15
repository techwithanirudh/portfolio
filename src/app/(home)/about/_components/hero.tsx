import { Section } from '@/components/section';
import * as motion from 'motion/react-client';
import Image from 'next/image';
import type React from 'react';
export default function CTA(): React.ReactElement {
  return (
    <Section className='grid divide-y divide-dashed divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0'>
      <div className='flex flex-col justify-center gap-2 px-6 py-10 md:py-14'>
        <h4 className='font-regular text-3xl tracking-tighter md:text-5xl'>
          The Moderator
        </h4>
        <p className='mt-4 max-w-lg text-lg text-muted-foreground leading-relaxed'>
          I’m a community builder who loves transforming small forums into
          vibrant hangouts. I’m also a Discourse moderator, skilled in managing
          categories, plugins, and keeping conversations welcoming. When I’m not
          handling forum tasks, I play chess and binge‑watch YouTube.
        </p>
      </div>

      <div className='flex w-full items-center justify-center px-6 py-10 md:py-14'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='relative flex items-center justify-center overflow-hidden rounded-md border-2 border-border p-1 shadow-sm transition-transform hover:scale-110'
        >
          <Image
            src='/icon.png'
            alt='Profile picture'
            width={300}
            height={300}
            className='rounded-sm'
            priority
          />
        </motion.div>
      </div>
    </Section>
  );
}
