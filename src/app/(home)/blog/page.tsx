import type { Metadata, ResolvingMetadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Posts from '@/app/(home)/_components/posts'
import { CollectionPageJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import { Wrapper } from '@/components/layout/wrapper'
import { NumberedPagination } from '@/components/numbered-pagination'
import { postsPerPage } from '@/constants/config'
import { createMetadata } from '@/lib/metadata'
import { parsePageParam } from '@/lib/pagination'
import { getPostsByTag, getSortedByDatePosts, getTags } from '@/lib/source'
import { Hero } from './_components/hero'
import { NewsletterSection } from './_components/newsletter-section'
import { TagsRow } from './_components/tags-sidebar'

export const dynamicParams = false

const totalPosts = getSortedByDatePosts().length
const pageCount = Math.ceil(totalPosts / postsPerPage)

const getTagsWithCount = () => {
  const tagNames = getTags()
  return tagNames.map((name) => ({
    count: getPostsByTag(name).length,
    name,
  }))
}

const Pagination = ({ pageIndex }: { pageIndex: number }) => {
  const handlePageChange = async (page: number) => {
    'use server'
    redirect(`/blog?page=${page}`)
  }

  return (
    <Section className='py-2'>
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
  const pageIndex = parsePageParam(searchParams.page) - 1
  if (pageIndex < 0 || pageIndex >= pageCount) {
    notFound()
  }

  const startIndex = pageIndex * postsPerPage
  const endIndex = startIndex + postsPerPage
  const posts = getSortedByDatePosts().slice(startIndex, endIndex)
  const tags = getTagsWithCount()

  return (
    <Wrapper>
      <Hero
        endIndex={endIndex}
        startIndex={startIndex}
        totalPosts={totalPosts}
      />
      <Section>
        <TagsRow tags={tags} />
      </Section>
      <Posts posts={posts} />
      {pageCount > 1 && <Pagination pageIndex={pageIndex} />}
      <NewsletterSection />
      <CollectionPageJsonLd
        description='Notes on design engineering, full-stack development, AI experiments, and how I built recent projects.'
        path='/blog'
        title='Blog'
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
  const pageTitle = isFirstPage ? 'Posts' : `Posts - Page ${pageIndex}`
  const canonicalUrl = isFirstPage ? '/blog' : `/blog?page=${pageIndex}`
  const description = isFirstPage
    ? 'Notes on design engineering, full-stack development, AI experiments, and how I built recent projects.'
    : `Browse page ${pageIndex} of blog posts.`

  return createMetadata({
    alternates: {
      canonical: canonicalUrl,
    },
    description,
    openGraph: {
      url: canonicalUrl,
    },
    title: pageTitle,
  })
}
