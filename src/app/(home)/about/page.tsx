import type { Metadata } from 'next'
import { ProfilePageJsonLd } from '@/components/json-ld'
import { SectionDivider } from '@/components/layout/sections/separator'
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

// Reads "About me" with the portrait between the words, like the page heading
const aboutOgImage = `/og?${new URLSearchParams({
  description: profileDescription,
  portrait: '1',
  title: 'About me',
})}`

export const metadata: Metadata = createMetadata({
  alternates: { canonical: pages.about.path },
  description: profileDescription,
  openGraph: { images: aboutOgImage, url: pages.about.path },
  title: pages.about.title,
  twitter: { images: aboutOgImage },
})

export default async function AboutPage() {
  const contributions = await getGitHubContributions()

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
        <SectionDivider />
        <Experience />
        <SectionDivider />
        <Stack />
        <SectionDivider />
        <ActivityHeader />
        <Contributions contributions={contributions} />
        <Feed />
        <SectionDivider />
        <CTA />
      </Wrapper>
    </>
  )
}
