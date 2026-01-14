import { unstable_cache } from 'next/cache'
import type { Activity } from '@/components/kibo-ui/contribution-graph'
import Separator from '@/components/separator'
import { Wrapper } from '@/components/wrapper'
import { testimonials } from '@/constants/portfolio/testimonials'
import { baseOptions } from '@/constants/site'
import { getSortedByDateWork } from '@/lib/source'
import About from './_components/about'
import Contributions from './_components/contributions'
import CTA from './_components/cta'
import Hero from './_components/hero'
import Skills from './_components/skills'
import Testimonials from './_components/testimonials'
import WorkPreview from './_components/work'

const githubUrl = baseOptions.githubUrl ?? ''
const githubUsername = githubUrl.split('/').filter(Boolean).at(-1)

interface ContributionResponse {
  total: Record<string, number>
  contributions: Activity[]
}

const getCachedContributions = unstable_cache(
  async () => {
    if (!githubUsername) {
      throw new Error('GitHub username is missing from baseOptions.')
    }

    const url = new URL(
      `/v4/${githubUsername}?y=last`,
      'https://github-contributions-api.jogruber.de'
    )
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub contributions.')
    }

    const data = (await response.json()) as ContributionResponse

    return data.contributions
  },
  ['github-contributions'],
  { revalidate: 60 * 60 * 24 }
)

export default async function Home() {
  const works = getSortedByDateWork().slice(0, 4)
  const contributions = await getCachedContributions()

  return (
    <Wrapper>
      <Hero />
      <Separator />
      <About />
      <Separator />
      <Skills />
      <Separator />
      <WorkPreview works={works} />
      <Testimonials testimonials={testimonials} />
      <Separator />
      <Contributions data={contributions} />
      <Separator />
      <CTA />
    </Wrapper>
  )
}
