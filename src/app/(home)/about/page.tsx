import type { Metadata } from 'next'
import { ProfilePageJsonLd } from '@/components/json-ld'
import { Wrapper } from '@/components/layout/wrapper'
import { description as homeDescription } from '@/constants/site'
import { getGitHubContributions } from '@/lib/github-contributions'
import { createMetadata } from '@/lib/metadata'
import Contributions from '../_components/contributions'
import CTA from '../_components/cta'
import Skills from '../_components/skills'
import Detailed from './_components/detailed'
import Experience from './_components/experience'
import Feed from './_components/feed'
import Hero from './_components/hero'

export const metadata: Metadata = createMetadata({
  alternates: { canonical: '/about' },
  description: homeDescription,
  openGraph: { url: '/about' },
  title: 'About',
})

export default function AboutPage() {
  const contributions = getGitHubContributions()

  return (
    <>
      <ProfilePageJsonLd
        description={homeDescription}
        path='/about'
        title='About'
      />
      <Wrapper>
        <Hero />
        <Detailed />
        <Skills />
        <Experience />
        <Contributions contributions={contributions} />
        <Feed />
        <CTA />
      </Wrapper>
    </>
  )
}
