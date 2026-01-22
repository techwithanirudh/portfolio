import type { Metadata } from 'next'
import { Wrapper } from '@/components/wrapper'
import { createMetadata } from '@/lib/metadata'
import Apps from './_components/apps'
import Hero from './_components/hero'

const title = 'Uses'
const description =
  'The software, services, and gadgets that keep my daily workflow smooth and focused.'

export function generateMetadata(): Metadata {
  return createMetadata({
    title,
    description,
    openGraph: { url: '/uses' },
    alternates: { canonical: '/uses' },
  })
}

export default function UsesPage() {
  return (
    <Wrapper>
      <Hero description={description} title={title} />
      <Apps />
    </Wrapper>
  )
}
