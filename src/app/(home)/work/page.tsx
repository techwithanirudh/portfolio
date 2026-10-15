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
    redirect(`/work?page=${page}`)
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
  const canonicalUrl = isFirstPage ? '/work' : `/work?page=${currentPage}`
  const jsonLdTitle = isFirstPage ? 'Work' : `Work - Page ${currentPage}`

  return (
    <Wrapper>
      <Hero
        endIndex={endIndex}
        startIndex={startIndex}
        totalWorks={totalWorks}
      />
      <Section>
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
      </Section>
      <Section>
        {/* Every cell draws its own bottom rule; the last row's lands exactly on
            the section's screen-wide line, so the two never double up */}
        <ul className='grid grid-cols-1 md:grid-cols-2'>
          {work.map((entry, index) => (
            <li
              className='border-line border-b md:odd:border-r'
              key={entry.url}
            >
              <ViewAnimation
                blur={false}
                className='h-full'
                delay={0.05 * index}
                duration={0.25}
                initial={{ opacity: 0, translateY: -6 }}
                whileInView={{ opacity: 1, translateY: 0 }}
              >
                <WorkCard
                  description={entry.data.description ?? ''}
                  image={entry.data.image ?? null}
                  meta={getWorkMeta(entry)}
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
  const pageTitle = isFirstPage ? 'Work' : `Work - Page ${pageIndex}`
  const canonicalUrl = isFirstPage ? '/work' : `/work?page=${pageIndex}`

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
