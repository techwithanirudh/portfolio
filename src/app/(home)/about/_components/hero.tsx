import * as motion from 'motion/react-client'
import Image from 'next/image'
import type React from 'react'
import { HeroSection } from '@/components/sections/hero'

export default function Hero(): React.ReactElement {
  const profileImage = (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className='relative flex items-center justify-center overflow-hidden rounded-md border-2 border-border p-1 shadow-sm transition-transform hover:scale-110'
      initial={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <Image
        alt='Profile picture'
        className='rounded-sm'
        height={300}
        priority
        src='/images/icon.png'
        width={300}
      />
    </motion.div>
  )

  return (
    <HeroSection
      align='start'
      description='I started building with Lego, moved into robotics with Mindstorms and EV3Dev, and now create AI and web apps with Python, OpenCV, TensorFlow, GPT, and Azure AI. I’ve collaborated with Bosch on autonomous car research, and I enjoy electronic music and sharing my work online.'
      image={profileImage}
      title='Tech Enthusiast'
      variant='compact'
    />
  )
}
