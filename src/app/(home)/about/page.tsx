import type { Metadata } from 'next'
import { ProfilePageJsonLd } from '@/components/json-ld'
import Separator from '@/components/layout/sections/separator'
import { Wrapper } from '@/components/layout/wrapper'
import { description as homeDescription } from '@/constants/site'
import { createMetadata } from '@/lib/metadata'
import Contact from '../_components/contact'
import Experience from './_components/experience'
import Feed from './_components/feed'
import Hero from './_components/hero'
import Story from './_components/story'

export const metadata: Metadata = createMetadata({
  alternates: { canonical: '/about' },
  description: homeDescription,
  openGraph: { url: '/about' },
  title: 'About',
})

export default function AboutPage() {
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
        <Feed />
        <Contact />
      </Wrapper>
    </>
  )
}
