import type { Metadata } from 'next'
import { ProjectGrid } from '@/components/features/projects/project-grid'
import { CollectionPageJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import { HeroSection } from '@/components/layout/sections/hero'
import { Wrapper } from '@/components/layout/wrapper'
import { NumberedPagination } from '@/components/numbered-pagination'
import { SearchRedirectInput } from '@/components/search-redirect-input'
import { ViewAnimation } from '@/components/view-animation'
import { projectsPerPage } from '@/constants/config'
import { pages } from '@/constants/pages'
import { createMetadata } from '@/lib/metadata'
import { getPageHref, paginate } from '@/lib/pagination'
import { getSortedProjects } from '@/lib/source'

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams
  const {
    currentPage,
    items: projects,
    pageCount,
  } = paginate(getSortedProjects(), projectsPerPage, searchParams.page)
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
            className='h-10 min-w-full rounded-none border-0 pl-1 shadow-none ring-inset'
            placeholder='Search projects…'
            tag='projects'
          />
        </ViewAnimation>
        <ProjectGrid
          columnsFrom='md'
          priorityCoverCount={2}
          projects={projects}
        />
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

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams

  const { currentPage } = paginate(
    getSortedProjects(),
    projectsPerPage,
    searchParams.page
  )

  const isFirstPage = currentPage === 1
  const pageTitle = isFirstPage
    ? pages.projects.title
    : `${pages.projects.title}, page ${currentPage}`
  const canonicalUrl = getPageHref(pages.projects.path, currentPage)

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
