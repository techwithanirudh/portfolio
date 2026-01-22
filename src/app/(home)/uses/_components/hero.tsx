import { HeroSection } from '@/components/sections/hero'

interface HeroProps {
  title: string
  description: string
}

export default function Hero({ title, description }: HeroProps) {
  return <HeroSection description={description} title={title} />
}
