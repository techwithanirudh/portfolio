import type { Metadata, ResolvingMetadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { RememberListPage } from '@/components/back-link'
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
import { getSortedWork, type WorkPage } from '@/lib/source'
import { Hero } from './_components/hero'

export const dynamicParams = false

const totalWorks = getSortedWork().length
const pageCount = Math.ceil(totalWorks / worksPerPage)

const getWorkMeta = (entry: WorkPage) => {
  const meta = [String(new Date(entry.data.date).getFullYear())]
  if (entry.data.website) {
    meta.push('Live')
  }
  if (entry.data.github) {
    meta.push('Source')
  }
  return meta
}

const Pagination = ({ pageIndex }: { pageIndex: number }) => {
  const handlePageChange = async (page: number) => {
    'use server'
    redirect(`/projects?page=${page}`)
  }

  return (
    <Section>
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
      <RememberListPage href='/projects' />
      <Hero
        endIndex={endIndex}
        startIndex={startIndex}
        totalWorks={totalWorks}
      />
      <Section>
        <SearchRedirectInput
          className='min-w-full'
          placeholder='Search projects...'
          tag='projects'
        />
      </Section>
      <Section>
        {/* The last row's bottom rule lands exactly on the section's line */}
        <ul className='grid grid-cols-1 md:grid-cols-2'>
          {work.map((entry, index) => (
            // An overlay, not a border, so both cells keep the same width
            <li
              className='relative border-line border-b md:odd:after:absolute md:odd:after:inset-y-0 md:odd:after:right-0 md:odd:after:z-10 md:odd:after:w-px md:odd:after:bg-line'
              key={entry.url}
            >
              <ViewAnimation className='h-full' delay={0.05 * index}>
                <WorkCard
                  description={entry.data.description ?? ''}
                  image={entry.data.image ?? null}
                  meta={getWorkMeta(entry)}
                  // The first row is the LCP on both layouts
                  priority={index < 2}
                  slugs={entry.slugs}
                  title={entry.data.title ?? 'Untitled'}
                  url={entry.url}
                />
              </ViewAnimation>
            </li>
          ))}
        </ul>
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
