import type { Metadata } from 'next'
import { ProfilePageJsonLd } from '@/components/json-ld'
import Separator from '@/components/layout/sections/separator'
import { Wrapper } from '@/components/layout/wrapper'
import { testimonials } from '@/constants/portfolio/testimonials'
import { description as homeDescription } from '@/constants/site'
import { createMetadata } from '@/lib/metadata'
import { getSortedWork } from '@/lib/source'
import About from './_components/about'
import Contact from './_components/contact'
import ExperiencePreview from './_components/experience'
import { Overview } from './_components/profile/overview'
import { ProfileCover } from './_components/profile/profile-cover'
import { ProfileHeader } from './_components/profile/profile-header'
import { SocialLinks } from './_components/profile/social-links'
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

  return (
    <>
      <ProfilePageJsonLd description={homeDescription} path='/' title='Home' />
      <Wrapper>
        <div className='container mx-auto'>
          <ProfileCover />
          <ProfileHeader />
          <Separator />
          <Overview />
          <SocialLinks />
          <Separator />
          <About />
          <Separator />
          <ExperiencePreview />
          <Separator />
          <WorkPreview works={works} />
          <Separator />
          <Testimonials testimonials={testimonials} />
          <Separator />
          <Contact />
        </div>
      </Wrapper>
    </>
  )
}
