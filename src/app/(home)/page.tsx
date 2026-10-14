import type { Metadata } from 'next'
import { ProfilePageJsonLd } from '@/components/json-ld'
import { Wrapper } from '@/components/layout/wrapper'
import { testimonials } from '@/constants/portfolio/testimonials'
import { description as homeDescription } from '@/constants/site'
import { createMetadata } from '@/lib/metadata'
import { getSortedWork } from '@/lib/source'
import Contact from './_components/contact'
import ExperiencePreview from './_components/experience'
import Hero from './_components/hero'
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
  const works = getSortedWork().slice(0, 3)

  return (
    <>
      <ProfilePageJsonLd description={homeDescription} path='/' title='Home' />
      <Wrapper>
        <Hero />
        <ExperiencePreview />
        <WorkPreview works={works} />
        <Testimonials testimonials={testimonials} />
        <Contact />
      </Wrapper>
    </>
  )
}
