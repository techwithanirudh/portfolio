import type { Metadata } from 'next'
import { getWork, getWriting } from '../_shared/profile'
import { ClockTile } from './_components/clock-tile'
import { ComponentAxis, ComponentRow } from './_components/component-row'
import { ConnectTile } from './_components/connect-tile'
import { ContactPanel } from './_components/contact-panel'
import { ContributionsTile } from './_components/contributions-tile'
import { ExperienceTable } from './_components/experience-table'
import { Hero } from './_components/hero'
import { LatestPostTile } from './_components/latest-post-tile'
import { NowTile } from './_components/now-tile'
import { Section } from './_components/section'
import { SimbaTile } from './_components/simba-tile'
import { StackTile } from './_components/stack-tile'
import { StatsTile } from './_components/stats-tile'
import { StatusPill } from './_components/status-pill'
import { TestimonialsMarquee } from './_components/testimonials-marquee'
import { WritingList } from './_components/writing-list'
import { BASE } from './_lib/routes'
import { getComponents, projectStatuses, yearsBuilding } from './_lib/timeline'

export const metadata: Metadata = {
  description:
    'A status page for Anirudh Sriram: what is running now, what shipped, and uptime since 2018.',
  title: 'Home',
}

export default function StatusHome() {
  const { axis, items } = getComponents()
  const pinned = items.filter((i) => i.pinned)
  const counts = projectStatuses.map((s) => ({
    ...s,
    count: items.filter((i) => i.status === s.status).length,
  }))

  return (
    <>
      <Hero />

      <div className='mx-auto flex max-w-[1200px] flex-col gap-16 px-4 pt-12 sm:px-6 md:gap-20 md:pt-16'>
        <Section
          action={{ href: `${BASE}/work`, label: `All ${items.length}` }}
          eyebrow={
            <span className='flex flex-wrap gap-x-3'>
              {counts.map((c) => (
                <span key={c.status}>
                  {c.count} {c.label}
                </span>
              ))}
            </span>
          }
          id='components'
          title='Components'
        >
          <div className='vs-card overflow-hidden'>
            <ComponentAxis axis={axis} />
            <ul className='divide-y divide-[var(--line)]'>
              {pinned.map((item) => (
                <ComponentRow compact item={item} key={item.slug} />
              ))}
            </ul>
          </div>
          <p className='vs-num mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[var(--faint)]'>
            <span>Pinned projects. Status is derived:</span>
            {projectStatuses.map((s) => (
              <span className='inline-flex items-center gap-1.5' key={s.status}>
                <StatusPill className='h-5 px-2 text-[11px]' kind={s.status} />
                {s.rule}
              </span>
            ))}
          </p>
        </Section>

        <Section
          eyebrow='Live, ticking every second'
          id='live'
          title='Right now'
        >
          <div className='grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12'>
            <NowTile />
            <ClockTile />
            <SimbaTile />
            <ContributionsTile />
            <StatsTile
              stats={[
                {
                  link: `${BASE}/work`,
                  linkText: 'Open Work',
                  title: 'Projects shipped',
                  value: getWork().length,
                },
                {
                  link: '/blog',
                  linkText: 'Read the blog',
                  title: 'Posts written',
                  value: getWriting().length,
                },
                {
                  link: `${BASE}/about`,
                  linkText: 'See the history',
                  suffix: 'yrs',
                  title: 'Years building',
                  value: yearsBuilding(),
                },
              ]}
            />
            <LatestPostTile />
            <StackTile />
            <ConnectTile />
          </div>
        </Section>

        <Section
          action={{ href: `${BASE}/about#experience`, label: 'By kind' }}
          eyebrow='Newest first'
          id='experience'
          title='Experience'
        >
          <ExperienceTable />
        </Section>

        <Section
          action={{ href: '/blog', label: 'All posts' }}
          eyebrow='Writing'
          id='writing'
          title='Changelog'
        >
          <WritingList limit={3} />
        </Section>

        <Section eyebrow='Testimonials' id='kind-words' title='Kind words'>
          <TestimonialsMarquee />
        </Section>

        <ContactPanel />
      </div>
    </>
  )
}
