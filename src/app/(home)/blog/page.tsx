import type { Metadata } from 'next'
import { CollectionPageJsonLd } from '@/components/json-ld'
import { Wrapper } from '@/components/layout/wrapper'
import { postsPerPage } from '@/constants/config'
import { pages } from '@/constants/pages'
import { createMetadata } from '@/lib/metadata'
import { getPageHref, paginate } from '@/lib/pagination'
import { getSortedByDatePosts } from '@/lib/source'
import { Hero } from './_components/hero'
import { NewsletterSection } from './_components/newsletter-section'
import { PostIndex } from './_components/post-index'

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams
  const {
    currentPage,
    items: posts,
    pageCount,
  } = paginate(getSortedByDatePosts(), postsPerPage, searchParams.page)

  return (
    <Wrapper>
      <Hero pageCount={pageCount} pageIndex={currentPage - 1} />
      <PostIndex
        currentPage={currentPage}
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
  const { currentPage } = paginate(
    getSortedByDatePosts(),
    postsPerPage,
    searchParams.page
  )

  const isFirstPage = currentPage === 1
  const pageTitle = isFirstPage
    ? pages.blog.title
    : `${pages.blog.title}, page ${currentPage}`
  const canonicalUrl = getPageHref(pages.blog.path, currentPage)
  const pageDescription = isFirstPage
    ? pages.blog.description
    : `Browse page ${currentPage} of blog posts.`

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
