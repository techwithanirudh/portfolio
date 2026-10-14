import type { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { PostCard } from '@/components/features/blog'
import { Icons } from '@/components/icons/icons'
import { TagJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import { HeroSection } from '@/components/layout/sections/hero'
import { NumberedPagination } from '@/components/numbered-pagination'
import { ViewAnimation } from '@/components/view-animation'
import { postsPerPage } from '@/constants/config'
import { createMetadata } from '@/lib/metadata'
import { parsePageParam } from '@/lib/pagination'
import { getPostsByTag, getTags } from '@/lib/source'

export const dynamicParams = false

const totalPosts = (title: string) => getPostsByTag(title).length
const pageCount = (title: string) => Math.ceil(totalPosts(title) / postsPerPage)

const Header = ({
  tag,
  startIndex,
  endIndex,
}: {
  tag: string
  startIndex: number
  endIndex: number
}) => {
  const total = totalPosts(tag)
  const end = Math.min(endIndex, total)
  return (
    <HeroSection
      caption={
        <Link
          className='group inline-flex items-center gap-1.5 transition-colors hover:text-foreground'
          href='/blog/tags'
        >
          <Icons.arrowLeft className='size-3.5 transition-transform group-hover:-translate-x-0.5' />
          Tags
        </Link>
      }
      description={`${total} ${total === 1 ? 'post' : 'posts'} tagged ${tag}${
        total > end - startIndex ? `, showing ${startIndex + 1}-${end}` : ''
      }.`}
      title={
        <span className='flex items-center gap-2'>
          <Icons.tag className='size-6 text-primary' />
          {tag}
        </span>
      }
    />
  )
}

const Pagination = ({ pageIndex, tag }: { pageIndex: number; tag: string }) => {
  const handlePageChange = async (page: number) => {
    'use server'
    redirect(`/blog/tags/${tag}?page=${page}`)
  }

  return (
    <Section className='py-2'>
      <NumberedPagination
        currentPage={pageIndex + 1}
        onPageChange={handlePageChange}
        paginationItemsToDisplay={5}
        totalPages={pageCount(tag)}
      />
    </Section>
  )
}

export default async function Page(props: {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams

  const tag = params.slug[0]
  if (!tag) {
    return notFound()
  }

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
      <Section>
        <div className='grid divide-y divide-dashed divide-line text-left'>
          {posts.map((post, index) => {
            const date = new Date(post.data.date).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
            return (
              <ViewAnimation
                delay={0.05 * index}
                initial={{ opacity: 0, translateY: -6 }}
                key={post.url}
                whileInView={{ opacity: 1, translateY: 0 }}
              >
                <PostCard
                  author={post.data.author ?? 'Unknown'}
                  date={date}
                  description={post.data.description ?? ''}
                  slugs={post.slugs}
                  title={post.data.title ?? 'Untitled'}
                  url={post.url}
                />
              </ViewAnimation>
            )
          })}
        </div>
      </Section>
      {pageCount(tag) > 1 && <Pagination pageIndex={pageIndex} tag={tag} />}
      <TagJsonLd tag={tag} />
    </>
  )
}

export const generateStaticParams = () => {
  const tags = getTags()
  return tags.map((tag) => ({ slug: [tag] }))
}

interface Props {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  props: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params
  const searchParams = await props.searchParams

  const tag = params.slug[0]
  if (!tag) {
    notFound()
  }
  const pageIndex = parsePageParam(searchParams.page)

  if (pageIndex < 1 || pageIndex > pageCount(tag)) {
    notFound()
  }

  const isFirstPage = pageIndex === 1 || !searchParams.page
  const pageTitle = isFirstPage
    ? `${tag} Posts`
    : `${tag} Posts - Page ${pageIndex}`
  const canonicalUrl = isFirstPage
    ? `/blog/tags/${tag}`
    : `/blog/tags/${tag}?page=${pageIndex}`
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
