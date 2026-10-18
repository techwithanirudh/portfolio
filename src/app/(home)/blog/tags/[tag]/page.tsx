import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PostIndex } from '@/app/(home)/blog/_components/post-index'
import { Icons } from '@/components/icons/icons'
import { TagJsonLd } from '@/components/json-ld'
import { HeroSection } from '@/components/layout/sections/hero'
import { Wrapper } from '@/components/layout/wrapper'
import { postsPerPage } from '@/constants/config'
import { pages } from '@/constants/pages'
import { createMetadata } from '@/lib/metadata'
import { getPageHref, parsePageParam } from '@/lib/pagination'
import { getPostsByTag, getTags } from '@/lib/source'

export const dynamicParams = false

interface Props {
  params: Promise<{ tag: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// TODO(slopradar): duplicate-logic: the tag path is also built in sitemap.ts and (llms)/utils/site-pages.ts, export one getTagUrl from @/lib/source
const getTagPath = (tag: string) => `/blog/tags/${tag}`
const getPageCount = (tag: string) =>
  Math.ceil(getPostsByTag(tag).length / postsPerPage)
const pluralizePosts = (count: number) =>
  `${count} ${count === 1 ? 'post' : 'posts'}`

const AllPostsLink = () => (
  <Link
    className='group inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground'
    href={pages.blog.path}
  >
    <Icons.arrowLeft
      aria-hidden
      className='size-4 transition-transform group-hover:-translate-x-0.5'
    />
    All posts
  </Link>
)

export default async function Page(props: Props) {
  const { tag } = await props.params
  const searchParams = await props.searchParams
  const tagPosts = getPostsByTag(tag)
  const pageCount = getPageCount(tag)
  const pageIndex = parsePageParam(searchParams.page) - 1

  if (pageIndex < 0 || pageIndex >= pageCount) {
    notFound()
  }

  const startIndex = pageIndex * postsPerPage
  const posts = tagPosts.slice(startIndex, startIndex + postsPerPage)
  const caption =
    pageIndex > 0
      ? `${pluralizePosts(tagPosts.length)}, page ${pageIndex + 1} of ${pageCount}`
      : pluralizePosts(tagPosts.length)

  return (
    <Wrapper>
      <HeroSection
        action={<AllPostsLink />}
        caption={<span className='font-mono text-sm'>{caption}</span>}
        title={tag}
      />
      <PostIndex
        activeTag={tag}
        currentPage={pageIndex + 1}
        path={getTagPath(tag)}
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

  const pageIndex = parsePageParam(searchParams.page)

  if (pageIndex < 1 || pageIndex > getPageCount(tag)) {
    notFound()
  }

  const isFirstPage = pageIndex === 1
  const pageTitle = isFirstPage
    ? `${tag} posts`
    : `${tag} posts, page ${pageIndex}`
  const canonicalUrl = getPageHref(getTagPath(tag), pageIndex)
  const description = isFirstPage
    ? `Blog posts tagged ${tag}, grouped by year.`
    : `Page ${pageIndex} of blog posts tagged ${tag}.`

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
