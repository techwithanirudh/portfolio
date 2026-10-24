import type { Metadata } from 'next'
import { connection } from 'next/server'
import { HeroSection } from '@/components/layout/sections/hero'
import { Wrapper } from '@/components/layout/wrapper'
import { pages } from '@/constants/pages'
import { createMetadata } from '@/lib/metadata'
import { SearchClient } from './_components/search-client'

export default async function Page() {
  // Rendered per request: a page built ahead of time can't read the query
  // string, so it would show a placeholder until the search box hydrated
  await connection()

  return (
    <Wrapper>
      <HeroSection title={pages.search.title} />
      <SearchClient />
    </Wrapper>
  )
}

export const metadata: Metadata = createMetadata({
  alternates: { canonical: pages.search.path },
  description: pages.search.description,
  openGraph: { url: pages.search.path },
  robots: { follow: false, index: false },
  title: pages.search.title,
})
