import type { Metadata, ResolvingMetadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { WorkCard } from '@/components/features/work'
import { CollectionPageJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import { Wrapper } from '@/components/layout/wrapper'
import { NumberedPagination } from '@/components/numbered-pagination'
import { SearchRedirectInput } from '@/components/search-redirect-input'
import { ViewAnimation } from '@/components/view-animation'
import { worksPerPage } from '@/constants/config'
import { createMetadata } from '@/lib/metadata'
import { parsePageParam } from '@/lib/pagination'
import { getSortedWork } from '@/lib/source'
import { Hero } from './_components/hero'

export const dynamicParams = false

const totalWorks = getSortedWork().length
const pageCount = Math.ceil(totalWorks / worksPerPage)

const Pagination = ({ pageIndex }: { pageIndex: number }) => {
  const handlePageChange = async (page: number) => {
    'use server'
    redirect(`/projects?page=${page}`)
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
  const pageIndex = parsePageParam(searchParams.page) - 1

  if (pageIndex < 0 || pageIndex >= pageCount) {
    notFound()
  }

  const startIndex = pageIndex * worksPerPage
  const endIndex = startIndex + worksPerPage
  const work = getSortedWork().slice(startIndex, endIndex)
  const currentPage = pageIndex + 1
  const isFirstPage = currentPage === 1
  const canonicalUrl = isFirstPage
    ? '/projects'
    : `/projects?page=${currentPage}`
  const jsonLdTitle = isFirstPage
    ? 'Projects'
    : `Projects - Page ${currentPage}`

  return (
    <Wrapper>
      <Hero
        endIndex={endIndex}
        startIndex={startIndex}
        totalWorks={totalWorks}
      />
      <Section
        className='flex flex-col divide-y divide-dashed divide-border'
        sectionClassName='flex flex-1'
      >
        <ViewAnimation delay={0.05}>
          <SearchRedirectInput
            className='min-w-full'
            placeholder='Search projects...'
            tag='projects'
          />
        </ViewAnimation>
        <div className='grid grid-cols-1 divide-y divide-dashed divide-border md:grid-cols-2 md:divide-x'>
          {work.map((entry, index) => (
            <ViewAnimation delay={0.05 * index} key={entry.url}>
              <WorkCard
                description={entry.data.description ?? ''}
                image={entry.data.image ?? null}
                // The first row is the LCP on both layouts
                priority={index < 2}
                slugs={entry.slugs}
                title={entry.data.title ?? 'Untitled'}
                url={entry.url}
              />
            </ViewAnimation>
          ))}
        </div>
      </Section>
      {pageCount > 1 && <Pagination pageIndex={pageIndex} />}
      <CollectionPageJsonLd
        description="Projects and collaborations I've worked on."
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
  const pageTitle = isFirstPage ? 'Projects' : `Projects - Page ${pageIndex}`
  const canonicalUrl = isFirstPage ? '/projects' : `/projects?page=${pageIndex}`

  return createMetadata({
    alternates: {
      canonical: canonicalUrl,
    },
    description: "Projects and collaborations I've worked on.",
    openGraph: {
      url: canonicalUrl,
    },
    title: pageTitle,
  })
}
