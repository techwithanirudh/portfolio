import type React from 'react'
import { HeroSection } from '@/components/sections/hero'

export default function Hero(): React.ReactElement {
  return (
    <HeroSection
      align='center'
      description="I'm Anirudh (techwithanirudh), a developer who builds web apps and AI tools and keeps exploring new ideas."
      title='About'
      variant='default'
    />
  )
}
