import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import Posts from '@/app/(home)/_components/posts'
import { CollectionPageJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import { SectionBody } from '@/components/layout/sections/body'
import { Wrapper } from '@/components/layout/wrapper'
import { NumberedPagination } from '@/components/numbered-pagination'
import { postsPerPage } from '@/constants/config'
import { pages } from '@/constants/pages'
import { createMetadata } from '@/lib/metadata'
import { getPageHref, parsePageParam } from '@/lib/pagination'
import { getPostsByTag, getSortedByDatePosts, getTags } from '@/lib/source'
import { Hero } from './_components/hero'
import { NewsletterSection } from './_components/newsletter-section'
import { TagsAccordion, TagsSidebar } from './_components/tags-sidebar'

const totalPosts = getSortedByDatePosts().length
const pageCount = Math.ceil(totalPosts / postsPerPage)

const getTagsWithCount = () => {
  const tagNames = getTags()
  return tagNames.map((name) => ({
    count: getPostsByTag(name).length,
    name,
  }))
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
      <Hero pageCount={pageCount} pageIndex={pageIndex} />
      <SectionBody>
        <div className='grid h-full lg:grid-cols-[1fr_280px]'>
          <div className='dashed-stack min-w-0 lg:border-border lg:border-r lg:border-dashed'>
            <TagsAccordion tags={tags} />
            <Posts
              className='h-full border-none'
              posts={posts}
              sectionClassName='flex flex-1'
            />
          </div>
          <aside className='hidden lg:block'>
            <TagsSidebar tags={tags} />
          </aside>
        </div>
      </SectionBody>
      {pageCount > 1 && (
        <Section className='bg-dashed'>
          <NumberedPagination
            currentPage={pageIndex + 1}
            getHref={(page) => getPageHref(pages.blog.path, page)}
            totalPages={pageCount}
          />
        </Section>
      )}
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
