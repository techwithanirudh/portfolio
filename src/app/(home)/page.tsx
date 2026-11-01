import type { Metadata } from 'next'
import { ProfilePageJsonLd } from '@/components/json-ld'
import { SectionDivider } from '@/components/layout/sections/separator'
import { Wrapper } from '@/components/layout/wrapper'
import { pages } from '@/constants/pages'
import { testimonials } from '@/constants/portfolio/testimonials'
import { createMetadata } from '@/lib/metadata'
import { getSortedByDatePosts, getSortedProjects } from '@/lib/source'
import About from './_components/about'
import CTA from './_components/cta'
import ExperiencePreview from './_components/experience'
import Hero from './_components/hero'
import ProjectsPreview from './_components/projects'
import Testimonials from './_components/testimonials'
import Writing from './_components/writing'

export const metadata: Metadata = createMetadata({
  alternates: { canonical: pages.home.path },
  description: pages.home.description,
  openGraph: { images: '/banner.png', url: pages.home.path },
  title: pages.home.title,
  twitter: { images: '/banner.png' },
})

export default function Home() {
  const projects = getSortedProjects().slice(0, 4)
  const posts = getSortedByDatePosts().slice(0, 3)

  return (
    <>
      <ProfilePageJsonLd
        description={pages.home.description}
        path={pages.home.path}
        title={pages.home.title}
      />
      <Wrapper>
        <Hero />
        <SectionDivider />
        <About />
        <SectionDivider />
        <ExperiencePreview />
        <SectionDivider />
        <ProjectsPreview projects={projects} />
        <SectionDivider />
        <Writing posts={posts} />
        <SectionDivider />
        <Testimonials testimonials={testimonials} />
        <SectionDivider />
        <CTA />
      </Wrapper>
    </>
  )
}
