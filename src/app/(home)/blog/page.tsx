import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { CollectionPageJsonLd } from '@/components/json-ld'
import { Wrapper } from '@/components/layout/wrapper'
import { postsPerPage } from '@/constants/config'
import { pages } from '@/constants/pages'
import { createMetadata } from '@/lib/metadata'
import { getPageHref, parsePageParam } from '@/lib/pagination'
import { getSortedByDatePosts } from '@/lib/source'
import { Hero } from './_components/hero'
import { NewsletterSection } from './_components/newsletter-section'
import { PostIndex } from './_components/post-index'

const totalPosts = getSortedByDatePosts().length
const pageCount = Math.ceil(totalPosts / postsPerPage)

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const pageIndex = parsePageParam(searchParams.page) - 1
  if (pageIndex < 0 || pageIndex >= pageCount) {
    notFound()
  }

  const startIndex = pageIndex * postsPerPage
  const posts = getSortedByDatePosts().slice(
    startIndex,
    startIndex + postsPerPage
  )

  return (
    <Wrapper>
      <Hero pageCount={pageCount} pageIndex={pageIndex} />
      <PostIndex
        currentPage={pageIndex + 1}
        path={pages.blog.path}
        posts={posts}
        totalPages={pageCount}
      />
      <NewsletterSection />
      <CollectionPageJsonLd
        description={pages.blog.description}
        path={pages.blog.path}
        title={pages.blog.title}
      />
    </Wrapper>
  )
}

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  props: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const searchParams = await props.searchParams

  const pageIndex = parsePageParam(searchParams.page)

  if (pageIndex < 1 || pageIndex > pageCount) {
    notFound()
  }

  const isFirstPage = pageIndex === 1 || !searchParams.page
  const pageTitle = isFirstPage ? 'Posts' : `Posts, page ${pageIndex}`
  const canonicalUrl = getPageHref(pages.blog.path, isFirstPage ? 1 : pageIndex)
  const pageDescription = isFirstPage
    ? pages.blog.description
    : `Browse page ${pageIndex} of blog posts.`

  return createMetadata({
    alternates: {
      canonical: canonicalUrl,
    },
    description: pageDescription,
    openGraph: {
      url: canonicalUrl,
    },
    title: pageTitle,
  })
}
