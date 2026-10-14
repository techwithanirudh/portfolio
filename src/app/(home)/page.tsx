import type { Metadata } from 'next'
import { ProfilePageJsonLd } from '@/components/json-ld'
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

// Hatched spacer between panels, the same band the old Separator drew
const Gap = () => (
  <div aria-hidden className='h-8 border-line border-x bg-dashed' />
)

export default async function Home() {
  const works = getSortedWork().slice(0, 3)

  return (
    <>
      <ProfilePageJsonLd description={homeDescription} path='/' title='Home' />
      <Wrapper>
        <div className='container mx-auto px-2 sm:px-0'>
          <ProfileCover />
          <ProfileHeader />
          <Gap />
          <Overview />
          <SocialLinks />
          <Gap />
          <About />
          <Gap />
          <ExperiencePreview />
          <Gap />
          <WorkPreview works={works} />
          <Gap />
          <Testimonials testimonials={testimonials} />
          <Gap />
          <Contact />
          <Gap />
        </div>
      </Wrapper>
    </>
  )
}
