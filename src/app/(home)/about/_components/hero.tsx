import type React from 'react'
import { HeroSection } from '@/components/sections/hero'

export default function Hero(): React.ReactElement {
  return (
    <HeroSection
      align='center'
      description="I'm Anirudh (techwithanirudh), a design engineer and full-stack developer who builds beautiful, functional websites."
      title='About'
      variant='default'
    />
  )
}
