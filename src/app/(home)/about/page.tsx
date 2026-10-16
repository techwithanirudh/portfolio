import type { Metadata } from 'next'
import { ProfilePageJsonLd } from '@/components/json-ld'
import Separator from '@/components/layout/sections/separator'
import { Wrapper } from '@/components/layout/wrapper'
import { description as homeDescription } from '@/constants/site'
import { getGitHubContributions } from '@/lib/github-contributions'
import { createMetadata } from '@/lib/metadata'
import Contributions from '../_components/contributions'
import CTA from '../_components/cta'
import ActivityHeader from './_components/activity'
import Experience from './_components/experience'
import Feed from './_components/feed'
import Hero from './_components/hero'
import Stack from './_components/stack'
import Story from './_components/story'

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
        <Separator />
        <Story />
        <Separator />
        <Experience />
        <Separator />
        <Stack />
        <Separator />
        <ActivityHeader />
        <Contributions contributions={contributions} />
        <Feed />
        <Separator />
        <CTA />
      </Wrapper>
    </>
  )
}
