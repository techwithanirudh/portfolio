import { HeroSection } from '@/components/sections/hero';
import * as motion from 'motion/react-client';
import Image from 'next/image';
import type React from 'react';

export default function Hero(): React.ReactElement {
  const profileImage = (
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
  );

  return (
    <HeroSection
      variant='compact'
      align='start'
      image={profileImage}
      title='The Moderator'
      description="I'm a community builder who loves transforming small forums into vibrant hangouts. I'm also a Discourse moderator, skilled in managing categories, plugins, and keeping conversations welcoming. When I'm not handling forum tasks, I play chess and binge‑watch YouTube."
    />
  );
}
