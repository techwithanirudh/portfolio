import type { Metadata } from 'next'
import { ProfilePageJsonLd } from '@/components/json-ld'
import Separator from '@/components/layout/sections/separator'
import { Wrapper } from '@/components/layout/wrapper'
import { pages } from '@/constants/pages'
import { testimonials } from '@/constants/portfolio/testimonials'
import { createMetadata } from '@/lib/metadata'
import { getSortedByDatePosts, getSortedWork } from '@/lib/source'
import About from './_components/about'
import CTA from './_components/cta'
import ExperiencePreview from './_components/experience'
import Hero from './_components/hero'
import Testimonials from './_components/testimonials'
import WorkPreview from './_components/work'
import Writing from './_components/writing'

export const metadata: Metadata = createMetadata({
  alternates: { canonical: pages.home.path },
  description: pages.home.description,
  openGraph: { images: '/banner.png', url: pages.home.path },
  title: pages.home.title,
  twitter: { images: '/banner.png' },
})

export default async function Home() {
  const works = getSortedWork().slice(0, 4)
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
        <Separator />
        <About />
        <Separator />
        <ExperiencePreview />
        <Separator />
        <WorkPreview works={works} />
        <Separator />
        <Writing posts={posts} />
        <Separator />
        <Testimonials testimonials={testimonials} />
        <Separator />
        <CTA />
      </Wrapper>
    </>
  )
}
