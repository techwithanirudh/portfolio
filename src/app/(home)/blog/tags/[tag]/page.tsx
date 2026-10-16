import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { PostList } from '@/components/features/blog/post-list'
import { Icons } from '@/components/icons/icons'
import { TagJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import { SectionBody } from '@/components/layout/sections/body'
import { HeroSection } from '@/components/layout/sections/hero'
import { NumberedPagination } from '@/components/numbered-pagination'
import { postsPerPage } from '@/constants/config'
import { createMetadata } from '@/lib/metadata'
import { getPageHref, parsePageParam } from '@/lib/pagination'
import { getPostsByTag, getTags } from '@/lib/source'

export const dynamicParams = false

interface Props {
  params: Promise<{ tag: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const totalPosts = (title: string) => getPostsByTag(title).length
const pageCount = (title: string) => Math.ceil(totalPosts(title) / postsPerPage)

const CurrentPostsCount = ({
  startIndex,
  endIndex,
  tag,
}: {
  startIndex: number
  endIndex: number
  tag: string
}) => {
  const total = totalPosts(tag)
  const start = startIndex + 1
  const end = endIndex < total ? endIndex : total
  if (start === end) {
    return <span>({start})</span>
  }
  return (
    <span>
      ({start}-{end})
    </span>
  )
}

const Header = ({
  tag,
  startIndex,
  endIndex,
}: {
  tag: string
  startIndex: number
  endIndex: number
}) => (
  <HeroSection
    title={
      <div className='flex items-center justify-between gap-4'>
        <span className='flex items-center gap-2'>
          <Icons.tag className='icon-tilt text-muted-foreground' size={20} />
          {tag} <span className='text-muted-foreground'>posts</span>{' '}
          <CurrentPostsCount
            endIndex={endIndex}
            startIndex={startIndex}
            tag={tag}
          />
        </span>
      </div>
    }
  />
)

export default async function Page(props: Props) {
  const { tag } = await props.params
  const searchParams = await props.searchParams

  const pageIndex = parsePageParam(searchParams.page) - 1

  if (pageIndex < 0 || pageIndex >= pageCount(tag)) {
    notFound()
  }

  const startIndex = pageIndex * postsPerPage
  const endIndex = startIndex + postsPerPage
  const posts = getPostsByTag(tag).slice(startIndex, endIndex)

  return (
    <>
      <Header endIndex={endIndex} startIndex={startIndex} tag={tag} />
      <SectionBody>
        <PostList posts={posts} />
      </SectionBody>
      {pageCount(tag) > 1 && (
        <Section className='bg-dashed'>
          <NumberedPagination
            currentPage={pageIndex + 1}
            getHref={(page) => getPageHref(`/blog/tags/${tag}`, page)}
            totalPages={pageCount(tag)}
          />
        </Section>
      )}
      <TagJsonLd tag={tag} />
    </>
  )
}

export const generateStaticParams = () => {
  const tags = getTags()
  return tags.map((tag) => ({ tag }))
}

export async function generateMetadata(
  props: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { tag } = await props.params
  const searchParams = await props.searchParams

  const pageIndex = parsePageParam(searchParams.page)

  if (pageIndex < 1 || pageIndex > pageCount(tag)) {
    notFound()
  }

  const isFirstPage = pageIndex === 1 || !searchParams.page
  const pageTitle = isFirstPage
    ? `${tag} posts`
    : `${tag} posts, page ${pageIndex}`
  const canonicalUrl = getPageHref(
    `/blog/tags/${tag}`,
    isFirstPage ? 1 : pageIndex
  )
  const description = isFirstPage
    ? `Browse blog posts tagged with ${tag}.`
    : `Browse page ${pageIndex} of blog posts tagged with ${tag}.`

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
