import type React from 'react'
import { HeroSection } from '@/components/sections/hero'

export default function Hero(): React.ReactElement {
  return (
    <HeroSection
      align='center'
      description="I'm Anirudh (techwithanirudh), a developer who tries to build cool stuff with code."
      title='About'
      variant='default'
    />
  )
}
