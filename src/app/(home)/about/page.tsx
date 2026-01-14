import { Wrapper } from '@/components/wrapper'
import { getSortedByDatePosts } from '@/lib/source'
import CTA from '../_components/cta'
import Skills from '../_components/skills'
import Detailed from './_components/detailed'
import Experience from './_components/experience'
import Hero from './_components/hero'
import Updates from './_components/updates'

export default function AboutPage() {
  const posts = getSortedByDatePosts()

  return (
    <Wrapper>
      <Hero />
      <Detailed />
      <Skills />
      <Experience />
      <Updates posts={posts} />
      <CTA />
    </Wrapper>
  )
}
