import type { Metadata } from 'next'
import { Wrapper } from '@/components/wrapper'
import { createMetadata } from '@/lib/metadata'
import Hero from './_components/hero'
import { UsesContent } from './_components/uses-content'

const title = 'Uses'
const description =
  'The hardware, software, and tools that power my daily workflow.'

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
      <UsesContent />
    </Wrapper>
  )
}
