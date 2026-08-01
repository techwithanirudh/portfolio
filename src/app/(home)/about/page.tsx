import type { Metadata } from 'next'
import { ProfilePageJsonLd } from '@/components/json-ld'
import { Wrapper } from '@/components/wrapper'
import { description as homeDescription } from '@/constants/site'
import { createMetadata } from '@/lib/metadata'
import { getSortedByDatePosts } from '@/lib/source'
import CTA from '../_components/cta'
import Skills from '../_components/skills'
import Detailed from './_components/detailed'
import Experience from './_components/experience'
import Feed from './_components/feed'
import Hero from './_components/hero'
import Updates from './_components/updates'

export const metadata: Metadata = createMetadata({
  alternates: { canonical: '/about' },
  description: homeDescription,
  openGraph: { url: '/about' },
  title: 'About',
})

export default function AboutPage() {
  const posts = getSortedByDatePosts()

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
        <Updates posts={posts} />
        <Feed />
        <CTA />
      </Wrapper>
    </>
  )
}
