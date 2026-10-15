import type React from 'react'
import { HeroSection } from '@/components/layout/sections/hero'

export default function Hero(): React.ReactElement {
  return (
    <HeroSection
      align='center'
      description="I'm Anirudh (techwithanirudh), a design engineer and full-stack developer who designs websites and writes the code behind them."
      title='About'
      variant='default'
    />
  )
}
