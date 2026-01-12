import { HeroSection } from '@/components/sections/hero'

export const Hero = (_props: {
  totalWorks: number
  startIndex: number
  endIndex: number
}) => (
  <HeroSection
    align='center'
    description='A snapshot of recent projects and collaborations.'
    title='Work'
    variant='default'
  />
)
