import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { WorkGrid } from '@/components/features/work/work-grid'
import { CollectionPageJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import { HeroSection } from '@/components/layout/sections/hero'
import { Wrapper } from '@/components/layout/wrapper'
import { NumberedPagination } from '@/components/numbered-pagination'
import { SearchRedirectInput } from '@/components/search-redirect-input'
import { ViewAnimation } from '@/components/view-animation'
import { worksPerPage } from '@/constants/config'
import { pages } from '@/constants/pages'
import { createMetadata } from '@/lib/metadata'
import { getPageHref, parsePageParam } from '@/lib/pagination'
import { getSortedWork } from '@/lib/source'

const EAGER_COVERS = 2

const totalWorks = getSortedWork().length
const pageCount = Math.ceil(totalWorks / worksPerPage)

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const pageIndex = parsePageParam(searchParams.page) - 1

  if (pageIndex < 0 || pageIndex >= pageCount) {
    notFound()
  }

  const startIndex = pageIndex * worksPerPage
  const endIndex = startIndex + worksPerPage
  const work = getSortedWork().slice(startIndex, endIndex)
  const currentPage = pageIndex + 1
  const isFirstPage = currentPage === 1
  const canonicalUrl = getPageHref(pages.projects.path, currentPage)
  const jsonLdTitle = isFirstPage
    ? pages.projects.title
    : `${pages.projects.title}, page ${currentPage}`

  return (
    <Wrapper>
      <HeroSection
        description={pages.projects.description}
        title={pages.projects.title}
      />
      <Section
        className='dashed-stack flex flex-col'
        sectionClassName='flex flex-1'
      >
        <ViewAnimation delay={0.05}>
          <SearchRedirectInput
            className='h-10 min-w-full rounded-none border-0 shadow-none'
            placeholder='Search projects...'
            tag='projects'
          />
        </ViewAnimation>
        <WorkGrid columnsFrom='md' eagerCount={EAGER_COVERS} works={work} />
      </Section>
      {pageCount > 1 && (
        <Section className='bg-dashed'>
          <NumberedPagination
            currentPage={currentPage}
            getHref={(page) => getPageHref(pages.projects.path, page)}
            totalPages={pageCount}
          />
        </Section>
      )}
      <CollectionPageJsonLd
        description={pages.projects.description}
        path={canonicalUrl}
        title={jsonLdTitle}
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
  const pageTitle = isFirstPage
    ? pages.projects.title
    : `${pages.projects.title}, page ${pageIndex}`
  const canonicalUrl = getPageHref(
    pages.projects.path,
    isFirstPage ? 1 : pageIndex
  )

  return createMetadata({
    alternates: {
      canonical: canonicalUrl,
    },
    description: pages.projects.description,
    openGraph: {
      url: canonicalUrl,
    },
    title: pageTitle,
  })
}
