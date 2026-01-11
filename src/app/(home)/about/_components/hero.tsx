import * as motion from 'motion/react-client';
import Image from 'next/image';
import type React from 'react';
import { HeroSection } from '@/components/sections/hero';

export default function Hero(): React.ReactElement {
  const profileImage = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className='relative flex items-center justify-center overflow-hidden rounded-md border-2 border-border p-1 shadow-sm transition-transform hover:scale-110'
    >
      <Image
        src='/images/icon.png'
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
      title='Tech Enthusiast'
      description='I started building with Lego, moved into robotics with Mindstorms and EV3Dev, and now create AI and web apps with Python, OpenCV, TensorFlow, GPT, and Azure AI. I’ve collaborated with Bosch on autonomous car research, and I enjoy electronic music and sharing my work online.'
    />
  );
}
