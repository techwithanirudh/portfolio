import { HeroSection } from '@/components/sections/hero'
import { usesPageMeta } from '@/constants/uses'

export default function Hero() {
  return (
    <HeroSection
      caption={usesPageMeta.title}
      description={usesPageMeta.description}
      title='Everyday tools and services'
    />
  )
}
