import type { Metadata } from 'next'
import { Suspense } from 'react'
import { HeroSection } from '@/components/layout/sections/hero'
import { Wrapper } from '@/components/layout/wrapper'
import { Skeleton } from '@/components/ui/skeleton'
import { title as homeTitle } from '@/constants/site'
import { createMetadata } from '@/lib/metadata'
import { SearchClient } from './_components/search-client'

export default function Page() {
  return (
    <Wrapper>
      <HeroSection title='Search' />
      <Suspense
        fallback={
          <div className='flex flex-1 flex-col'>
            <Skeleton className='h-12 w-full rounded-none' />
            <Skeleton className='h-10 w-full rounded-none border-line border-t' />
          </div>
        }
      >
        <SearchClient />
      </Suspense>
    </Wrapper>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    alternates: {
      canonical: '/search',
    },
    description: `Search posts and projects on ${homeTitle}.`,
    openGraph: {
      url: '/search',
    },
    robots: { follow: false, index: false },
    title: 'Search',
  })
}
