import type { Metadata } from 'next'
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

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams
  // TODO(slopradar): duplicate-logic: parse, bounds check, slice and canonical logic is copied across blog, blog/tags/[tag] and projects and their generateMetadata, add a paginate(items, perPage, param) helper in @/lib/pagination
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

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams

  const pageIndex = parsePageParam(searchParams.page)

  if (pageIndex < 1 || pageIndex > pageCount) {
    notFound()
  }

  const isFirstPage = pageIndex === 1
  const pageTitle = isFirstPage
    ? pages.blog.title
    : `${pages.blog.title}, page ${pageIndex}`
  const canonicalUrl = getPageHref(pages.blog.path, pageIndex)
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
