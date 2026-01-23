import type { Metadata } from 'next'
import { Wrapper } from '@/components/wrapper'
import { colophonHero } from '@/constants/portfolio/colophon'
import { createMetadata } from '@/lib/metadata'
import { AttributionSection } from './_components/attribution'
import { DesignSection } from './_components/design'
import { Hero } from './_components/hero'
import { TechnologySection } from './_components/technology'

export default function ColophonPage() {
  return (
    <Wrapper>
      <Hero />
      <TechnologySection />
      <AttributionSection />
      <DesignSection />
    </Wrapper>
  )
}

export function generateMetadata(): Metadata {
  return createMetadata({
    title: colophonHero.title,
    description: colophonHero.description,
    openGraph: { url: '/colophon' },
    alternates: { canonical: '/colophon' },
  })
}
