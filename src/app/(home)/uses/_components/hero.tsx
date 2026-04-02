import { HeroSection } from '@/components/sections/hero'

interface HeroProps {
  description: string
  title: string
}

export default function Hero({ title, description }: HeroProps) {
  return <HeroSection description={description} title={title} />
}
