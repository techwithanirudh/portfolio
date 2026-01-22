import type { Metadata } from 'next'
import { Wrapper } from '@/components/wrapper'
import { usesPageMeta } from '@/constants/uses'
import { createMetadata } from '@/lib/metadata'
import Apps from './_components/apps'
import Hero from './_components/hero'

export function generateMetadata(): Metadata {
  return createMetadata({
    title: usesPageMeta.title,
    description: usesPageMeta.description,
    openGraph: { url: '/uses' },
    alternates: { canonical: '/uses' },
  })
}

export default function UsesPage() {
  return (
    <Wrapper>
      <Hero />
      <Apps />
    </Wrapper>
  )
}
