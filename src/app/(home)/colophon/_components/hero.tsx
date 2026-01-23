import { HeroSection } from '@/components/sections/hero'
import { colophonHero } from '@/constants/portfolio/colophon'

export const Hero = () => (
  <HeroSection
    description={colophonHero.description}
    title={colophonHero.title}
  />
)
