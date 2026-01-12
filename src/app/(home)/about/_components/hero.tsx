import type React from 'react'
import { HeroSection } from '@/components/sections/hero'

export default function Hero(): React.ReactElement {
  return (
    <HeroSection
      align='center'
      description="I'm Anirudh (techwithanirudh), a design engineer who builds with Next.js and AI tools."
      title='About'
      variant='default'
    />
  )
}
