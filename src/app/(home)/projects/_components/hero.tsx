import { HeroSection } from '@/components/layout/sections/hero'

export const Hero = (_props: {
  totalWorks: number
  startIndex: number
  endIndex: number
}) => (
  <HeroSection
    description='Recent projects and collaborations.'
    title='Projects'
  />
)
