import type { Metadata } from 'next'
import Separator from '@/components/layout/separator'
import { Wrapper } from '@/components/layout/wrapper'
import { ProfilePageJsonLd } from '@/components/seo/json-ld'
import { testimonials } from '@/constants/portfolio/testimonials'
import { description as homeDescription } from '@/constants/site'
import { getGitHubContributions } from '@/lib/github-contributions'
import { createMetadata } from '@/lib/metadata'
import { getSortedWork } from '@/lib/source'
import About from './_components/about'
import Contributions from './_components/contributions'
import CTA from './_components/cta'
import Hero from './_components/hero'
import Skills from './_components/skills'
import Testimonials from './_components/testimonials'
import WorkPreview from './_components/work'

export const metadata: Metadata = createMetadata({
  alternates: { canonical: '/' },
  description: homeDescription,
  openGraph: { images: '/banner.png', url: '/' },
  title: 'Home',
  twitter: { images: '/banner.png' },
})

export default async function Home() {
  const works = getSortedWork().slice(0, 4)
  const contributions = getGitHubContributions()

  return (
    <>
      <ProfilePageJsonLd description={homeDescription} path='/' title='Home' />
      <Wrapper>
        <Hero />
        <Separator />
        <About />
        <Separator />
        <Skills />
        <Separator />
        <WorkPreview works={works} />
        <Testimonials testimonials={testimonials} />
        <Separator />
        <Contributions contributions={contributions} />
        <Separator />
        <CTA />
      </Wrapper>
    </>
  )
}
