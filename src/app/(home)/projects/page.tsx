import type { Metadata } from 'next'
import { ProjectIndex } from '@/components/features/projects/project-index'
import { CollectionPageJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import { HeroSection } from '@/components/layout/sections/hero'
import { Wrapper } from '@/components/layout/wrapper'
import { pages } from '@/constants/pages'
import { createMetadata } from '@/lib/metadata'
import { getProjectYear, getSortedProjects } from '@/lib/source'

export default function Page() {
  const projects = getSortedProjects().map((project) => ({
    description: project.data.description ?? '',
    github: Boolean(project.data.github),
    image: project.data.image ?? null,
    imageCrop: project.data.imageCrop,
    slug: project.slugs.join('/'),
    tags: project.data.tags ?? [],
    title: project.data.title,
    url: project.url,
    website: Boolean(project.data.website),
    year: getProjectYear(project),
  }))

  return (
    <Wrapper>
      <HeroSection
        description={pages.projects.description}
        title={pages.projects.title}
      />
      <Section>
        <ProjectIndex projects={projects} />
      </Section>
      <CollectionPageJsonLd
        description={pages.projects.description}
        path={pages.projects.path}
        title={pages.projects.title}
      />
    </Wrapper>
  )
}

export const metadata: Metadata = createMetadata({
  alternates: {
    canonical: pages.projects.path,
  },
  description: pages.projects.description,
  openGraph: {
    url: pages.projects.path,
  },
  title: pages.projects.title,
})
