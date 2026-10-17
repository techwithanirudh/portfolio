import type { Metadata } from 'next'
import { Suspense } from 'react'
import { HeroSection } from '@/components/layout/sections/hero'
import { Wrapper } from '@/components/layout/wrapper'
import { Skeleton } from '@/components/ui/skeleton'
import { pages } from '@/constants/pages'
import { createMetadata } from '@/lib/metadata'
import { BackButton } from './_components/back-button'
import { SearchClient } from './_components/search-client'

export default function Page() {
  return (
    <Wrapper>
      <HeroSection caption={<BackButton />} title={pages.search.title} />
      <Suspense
        fallback={
          <div className='flex flex-1 flex-col gap-4 px-4 pb-10 sm:px-6'>
            <Skeleton className='h-9 w-full' />
            <div className='grid gap-2'>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton className='h-14 w-full' key={index.toString()} />
              ))}
            </div>
          </div>
        }
      >
        <SearchClient />
      </Suspense>
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
