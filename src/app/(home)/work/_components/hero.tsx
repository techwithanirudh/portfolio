import { HeroSection } from '@/components/sections/hero'

export const Hero = (_props: {
  totalWorks: number
  startIndex: number
  endIndex: number
}) => (
  <HeroSection
    align='center'
    description='Selected work highlighting product, design, and engineering outcomes.'
    title='Selected Work'
    variant='default'
  />
)
