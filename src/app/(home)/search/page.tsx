import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/hero'
import { Wrapper } from '@/components/wrapper'
import { title as homeTitle } from '@/constants/site'
import { createMetadata } from '@/lib/metadata'
import { SearchClient } from './_components/search-client'

export default function Page() {
  return (
    <Wrapper>
      <HeroSection
        align='center'
        description='Search across blog posts and work.'
        title='Search'
      />
      <SearchClient />
    </Wrapper>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: 'Search',
    description: `Search posts and projects on ${homeTitle}.`,
    openGraph: {
      url: '/search',
    },
    alternates: {
      canonical: '/search',
    },
  })
}
