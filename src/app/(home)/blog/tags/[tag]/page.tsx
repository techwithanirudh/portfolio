import type { Metadata } from 'next'
import { PostIndex } from '@/app/(home)/blog/_components/post-index'
import { tagPath } from '@/components/features/blog/tag-path'
import { TagJsonLd } from '@/components/json-ld'
import { HeroSection } from '@/components/layout/sections/hero'
import { Wrapper } from '@/components/layout/wrapper'
import { postsPerPage } from '@/constants/config'
import { createMetadata } from '@/lib/metadata'
import { getPageHref, paginate } from '@/lib/pagination'
import { getPostsByTag, getTags } from '@/lib/source'

export const dynamicParams = false

interface Props {
  params: Promise<{ tag: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const pluralizePosts = (count: number) =>
  `${count} ${count === 1 ? 'post' : 'posts'}`

export default async function Page(props: Props) {
  const { tag } = await props.params
  const searchParams = await props.searchParams
  const tagPosts = getPostsByTag(tag)
  const {
    currentPage,
    items: posts,
    pageCount,
  } = paginate(tagPosts, postsPerPage, searchParams.page)
  const caption =
    currentPage > 1
      ? `${pluralizePosts(tagPosts.length)}, page ${currentPage} of ${pageCount}`
      : pluralizePosts(tagPosts.length)

  return (
    <Wrapper>
      <HeroSection
        caption={<span className='font-mono text-sm'>{caption}</span>}
        title={tag}
      />
      <PostIndex
        activeTag={tag}
        currentPage={currentPage}
        path={tagPath(tag)}
        posts={posts}
        totalPages={pageCount}
      />
      <TagJsonLd tag={tag} />
    </Wrapper>
  )
}

export const generateStaticParams = () => getTags().map((tag) => ({ tag }))

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { tag } = await props.params
  const searchParams = await props.searchParams

  const { currentPage } = paginate(
    getPostsByTag(tag),
    postsPerPage,
    searchParams.page
  )

  const isFirstPage = currentPage === 1
  const pageTitle = isFirstPage
    ? `${tag} posts`
    : `${tag} posts, page ${currentPage}`
  const canonicalUrl = getPageHref(tagPath(tag), currentPage)
  const description = isFirstPage
    ? `Blog posts tagged ${tag}, grouped by year.`
    : `Page ${currentPage} of blog posts tagged ${tag}.`

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
