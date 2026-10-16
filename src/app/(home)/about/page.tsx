import type { Metadata } from 'next'
import { ProfilePageJsonLd } from '@/components/json-ld'
import Separator from '@/components/layout/sections/separator'
import { Wrapper } from '@/components/layout/wrapper'
import { pages } from '@/constants/pages'
import { description as profileDescription } from '@/constants/site'
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

// A profile page, so search results get the full site description rather
// than the hero's short line
export const metadata: Metadata = createMetadata({
  alternates: { canonical: pages.about.path },
  description: profileDescription,
  openGraph: { url: pages.about.path },
  title: pages.about.title,
})

export default function AboutPage() {
  const contributions = getGitHubContributions()

  return (
    <>
      <ProfilePageJsonLd
        description={profileDescription}
        path={pages.about.path}
        title={pages.about.title}
      />
      <Wrapper>
        <Hero />
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
