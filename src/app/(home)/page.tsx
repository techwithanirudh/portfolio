import { baseOptions } from '@/app/layout.shared'
import type { Activity } from '@/components/kibo-ui/contribution-graph'
import Separator from '@/components/separator'
import { Wrapper } from '@/components/wrapper'
import { getSortedByDateWork } from '@/lib/source'
import { unstable_cache } from 'next/cache'
import About from './_components/about'
import Contributions from './_components/contributions'
import CTA from './_components/cta'
import Hero from './_components/hero'
import Skills from './_components/skills'
import Testimonials from './_components/testimonials'
import { testimonials } from './_components/testimonials/data'
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
      `/v4/${githubUsername}`,
      'https://github-contributions-api.jogruber.de'
    )
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub contributions.')
    }

    const data = (await response.json()) as ContributionResponse
    const year = new Date().getFullYear()
    const total = data.total[String(year)] ?? 0
    const totalSquares = 417

    const sortedContributions = [...data.contributions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return {
      contributions: sortedContributions.slice(0, totalSquares),
      total,
      year,
    }
  },
  ['github-contributions'],
  { revalidate: 60 * 60 * 24 }
)

export default async function Home() {
  const works = getSortedByDateWork().slice(0, 4)
  const { contributions, total, year } = await getCachedContributions()

  return (
    <Wrapper lenis={{}}>
      <Hero />
      <Separator />
      <About />
      <Separator />
      <Skills />
      <Separator />
      <WorkPreview works={works} />
      <Testimonials testimonials={testimonials} />
      <Separator />
      <Contributions
        data={contributions}
        githubUrl={githubUrl}
        total={total}
        year={year}
      />
      <Separator />
      <CTA />
    </Wrapper>
  )
}
