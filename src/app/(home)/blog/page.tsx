import type { Metadata } from 'next'
import { CollectionPageJsonLd } from '@/components/json-ld'
import { Wrapper } from '@/components/layout/wrapper'
import { pages } from '@/constants/pages'
import { createMetadata } from '@/lib/metadata'
import { getSortedByDatePosts } from '@/lib/source'
import { Hero } from './_components/hero'
import { PostIndex } from './_components/post-index'

export default function Page() {
  return (
    <Wrapper>
      <Hero />
      <PostIndex posts={getSortedByDatePosts()} />
      <CollectionPageJsonLd
        description={pages.blog.description}
        path={pages.blog.path}
        title={pages.blog.title}
      />
    </Wrapper>
  )
}

export const metadata: Metadata = createMetadata({
  alternates: {
    canonical: pages.blog.path,
  },
  description: pages.blog.description,
  openGraph: {
    url: pages.blog.path,
  },
  title: pages.blog.title,
})
