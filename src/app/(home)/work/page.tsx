import type { Metadata, ResolvingMetadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { NumberedPagination } from '@/components/numbered-pagination'
import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import { WorkCard } from '@/components/work/work-card'
import { Wrapper } from '@/components/wrapper'
import { worksPerPage } from '@/constants/pagination'
import { createMetadata } from '@/lib/metadata'
import { getSortedByDateWork } from '@/lib/source'
import { Hero } from './_components/hero'

export const dynamicParams = false

const totalWorks = getSortedByDateWork().length
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
  const pageIndex = searchParams.page
    ? Number.parseInt(searchParams.page[0] ?? '', 10) - 1
    : 0

  if (pageIndex < 0 || pageIndex >= pageCount) {
    notFound()
  }

  const startIndex = pageIndex * worksPerPage
  const endIndex = startIndex + worksPerPage
  const work = getSortedByDateWork().slice(startIndex, endIndex)

  return (
    <Wrapper>
      <Hero
        endIndex={endIndex}
        startIndex={startIndex}
        totalWorks={totalWorks}
      />
      <Section className='h-full' sectionClassName='flex flex-1'>
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
    </Wrapper>
  )
}

export const generateStaticParams = () => {
  const slugs = Array.from({ length: pageCount }, (_, index) => ({
    slug: [(index + 1).toString()],
  }))

  return [{ slug: [] }, ...slugs]
}

interface Props {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  props: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const searchParams = await props.searchParams

  const pageIndex = searchParams.page
    ? Number.parseInt(searchParams.page as string, 10)
    : 1

  const isFirstPage = pageIndex === 1 || !searchParams.page
  const pageTitle = isFirstPage ? 'Work' : `Work - Page ${pageIndex}`
  const canonicalUrl = isFirstPage ? '/work' : `/work?page=${pageIndex}`

  return createMetadata({
    title: pageTitle,
    description:
      'Selected work showcasing projects, collaborations, and outcomes.',
    openGraph: {
      url: canonicalUrl,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  })
}
