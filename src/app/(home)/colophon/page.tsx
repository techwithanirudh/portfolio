import type { Metadata } from 'next'
import { Wrapper } from '@/components/wrapper'
import { createMetadata } from '@/lib/metadata'
import { Attribution } from './_components/attribution'
import { Design } from './_components/design'
import Hero from './_components/hero'
import { Technology } from './_components/technology'
import { Typography } from './_components/typography'

const title = 'Colophon'
const description =
  'The tools, technologies, and inspirations behind this website.'

export default function ColophonPage() {
  return (
    <Wrapper>
      <Hero description={description} title={title} />
      <Technology />
      <Typography />
      <Design />
      <Attribution />
    </Wrapper>
  )
}

export function generateMetadata(): Metadata {
  return createMetadata({
    title,
    description,
    openGraph: { url: '/colophon' },
    alternates: { canonical: '/colophon' },
  })
}
