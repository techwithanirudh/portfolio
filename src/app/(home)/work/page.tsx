import type { Metadata, ResolvingMetadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { WorkCard } from '@/components/features/work/work-card'
import { Section } from '@/components/layout/sections/section'
import { Wrapper } from '@/components/layout/wrapper'
import { CollectionPageJsonLd } from '@/components/seo/json-ld'
import { NumberedPagination } from '@/components/shared/numbered-pagination'
import { SearchRedirectInput } from '@/components/shared/search-redirect-input'
import { ViewAnimation } from '@/components/shared/view-animation'
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
    redirect(`/work?page=${page}`)
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
  const canonicalUrl = isFirstPage ? '/work' : `/work?page=${currentPage}`
  const jsonLdTitle = isFirstPage ? 'Work' : `Work - Page ${currentPage}`

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
        <ViewAnimation
          delay={0.05}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <SearchRedirectInput
            className='min-w-full'
            placeholder='Search work...'
            tag='projects'
          />
        </ViewAnimation>
        <div className='grid grid-cols-1 divide-y divide-dashed divide-border md:grid-cols-2 md:divide-x'>
          {work.map((entry, index) => (
            <ViewAnimation
              blur={false}
              delay={0.05 * index}
              duration={0.25}
              initial={{ opacity: 0, translateY: -6 }}
              key={entry.url}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <WorkCard
                description={entry.data.description ?? ''}
                image={entry.data.image ?? null}
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
        description='Selected work showcasing projects, collaborations, and outcomes.'
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
  const pageTitle = isFirstPage ? 'Work' : `Work - Page ${pageIndex}`
  const canonicalUrl = isFirstPage ? '/work' : `/work?page=${pageIndex}`

  return createMetadata({
    alternates: {
      canonical: canonicalUrl,
    },
    description:
      'Selected work showcasing projects, collaborations, and outcomes.',
    openGraph: {
      url: canonicalUrl,
    },
    title: pageTitle,
  })
}
