import type { Metadata, ResolvingMetadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { postsPerPage } from '@/app/layout.shared'
import { NumberedPagination } from '@/components/numbered-pagination'
import { Section } from '@/components/section'
import { Wrapper } from '@/components/wrapper'
import { createMetadata } from '@/lib/metadata'
import { getSortedByDatePosts } from '@/lib/source'
import Posts from '../../_components/posts'
import { Hero } from './_components/hero'

export const dynamicParams = false

const totalPosts = getSortedByDatePosts().length
const pageCount = Math.ceil(totalPosts / postsPerPage)

const Pagination = ({ pageIndex }: { pageIndex: number }) => {
  const handlePageChange = async (page: number) => {
    'use server'
    redirect(`/blog?page=${page}`)
  }

  return (
    <Section className='bg-dashed'>
      <NumberedPagination
        currentPage={pageIndex + 1}
        onPageChange={handlePageChange}
        paginationItemsToDisplay={5}
        totalPages={pageCount}
      />
    </Section>
  )
}

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const pageIndex = searchParams.page
    ? Number.parseInt(searchParams.page[0] ?? '', 10) - 1
    : 0
  if (pageIndex < 0 || pageIndex >= pageCount) {
    notFound()
  }

  const startIndex = pageIndex * postsPerPage
  const endIndex = startIndex + postsPerPage
  const posts = getSortedByDatePosts().slice(startIndex, endIndex)

  return (
    <Wrapper>
      <Hero
        endIndex={endIndex}
        startIndex={startIndex}
        totalPosts={totalPosts}
      />
      <Posts className='h-full' posts={posts} sectionClassName='flex flex-1' />
      {pageCount > 1 && <Pagination pageIndex={pageIndex} />}
    </Wrapper>
  )
}

export const generateStaticParams = () => {
  const slugs = Array.from({ length: pageCount }, (_, index) => ({
    slug: [(index + 1).toString()],
  }))

  return [{ slug: [] }, ...slugs]
}

interface Props {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  props: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const _params = await props.params
  const searchParams = await props.searchParams

  const pageIndex = searchParams.page
    ? Number.parseInt(searchParams.page as string, 10)
    : 1

  const isFirstPage = pageIndex === 1 || !searchParams.page
  const pageTitle = isFirstPage ? 'Posts' : `Posts - Page ${pageIndex}`
  const canonicalUrl = isFirstPage ? '/blog' : `/blog?page=${pageIndex}`

  return createMetadata({
    title: pageTitle,
    description: `Posts${isFirstPage ? '' : ` - Page ${pageIndex}`}`,
    openGraph: {
      url: canonicalUrl,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  })
}
