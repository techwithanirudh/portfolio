import { Download, Mail } from 'lucide-react'
import type { Metadata } from 'next'
import { hardware, software } from '@/constants/portfolio/uses'
import {
  chapters,
  experiences,
  getWork,
  getWriting,
  groupedExperience,
  profile,
} from '../../_shared/profile'
import {
  type ChapterMedia,
  ExperienceGroup,
  HardwareGrid,
  Journey,
  SoftwareGrid,
} from '../_components/about-parts'
import { Artboard } from '../_components/artboard'
import { introInfo, yearsBuilding } from '../_components/data'
import { Avatar } from '../_components/hero'
import { BoardHeader } from '../_components/sections'
import { Selectable } from '../_components/selectable'

export const metadata: Metadata = {
  description: `How ${profile.name} got here: Lego, Python, the web, full stack and teams.`,
  title: 'About',
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className='ab-rule border-l pl-3'>
      <dt className='ab-t-label text-(--faint)'>{label}</dt>
      <dd className='mt-0.5 font-semibold text-[22px] tabular-nums leading-7 tracking-[-0.01em]'>
        {value}
      </dd>
    </div>
  )
}

export default function ArtboardAbout() {
  const work = getWork()
  const cover = (slug: string) => work.find((w) => w.slug === slug)?.image
  const media: ChapterMedia[] = [
    { label: 'photo: Lego Mindstorms builds, 2018' },
    { label: 'screenshot: an early OpenCV experiment, 2019' },
    {
      alt: 'Maskio, a pixel-art platformer',
      label: 'maskio/cover',
      src: cover('maskio'),
    },
    {
      alt: 'Shadcn Portfolio template',
      label: 'shadcn_portfolio/cover',
      src: cover('shadcn_portfolio'),
    },
    {
      alt: 'Autonomous driving privacy research',
      label: 'autonomous_driving/cover',
      src: cover('autonomous_driving'),
    },
  ]
  const companies = experiences.filter((c) => c.id !== 'personal').length

  return (
    <>
      <Artboard id='intro' name='Intro' page='About'>
        <Selectable info={introInfo} isDefault layer='Intro / Bio'>
          <div className='grid gap-8 p-6 sm:p-10 md:grid-cols-[minmax(0,1fr)_200px] md:gap-12 md:p-12'>
            <div className='order-2 min-w-0 md:order-1'>
              <p className='ab-t-label text-(--muted)'>
                About · {profile.location} · @{profile.handle}
              </p>
              <h1
                className='ab-t-title mt-3 max-w-[20ch] text-balance'
                data-layer='Headline'
                data-layer-type='text'
                data-outline-text
              >
                Design engineer and full-stack developer, building since 2018.
              </h1>
              <div
                className='ab-t-lead mt-5 grid max-w-[58ch] gap-4 text-(--muted)'
                data-layer='Bio'
                data-layer-type='text'
              >
                <p>
                  I’m {profile.name}. It started with Lego and Mindstorms, then
                  Python and AI, then the web, then full stack. The journey
                  below has the long version.
                </p>
                <p>
                  Now I’m a {profile.current.title} at{' '}
                  <a
                    className='ab-link text-(--ink)'
                    href={profile.current.url}
                    rel='noopener'
                    target='_blank'
                  >
                    {profile.current.company}
                  </a>
                  , which uses AI to generate, edit and animate SVGs. Which is
                  why this site is drawn like a design file.
                </p>
              </div>
              <dl className='mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4'>
                <Stat label='Years building' value={String(yearsBuilding())} />
                <Stat label='Projects' value={String(work.length)} />
                <Stat label='Teams' value={String(companies)} />
                <Stat label='Posts' value={String(getWriting().length)} />
              </dl>
              <div className='mt-8 flex flex-wrap gap-2'>
                <a
                  className='ab-btn ab-btn-primary'
                  download
                  href='/resume.pdf'
                >
                  <Download aria-hidden className='size-3.5' />
                  Download résumé
                </a>
                <a
                  className='ab-btn ab-btn-ghost'
                  href={`mailto:${profile.email}`}
                >
                  <Mail aria-hidden className='size-3.5' />
                  {profile.email}
                </a>
              </div>
            </div>
            <Avatar className='order-1 w-28 md:order-2 md:w-full md:pt-2' />
          </div>
        </Selectable>
      </Artboard>

      <Artboard id='journey' name='Journey' page='About'>
        <div className='p-6 sm:p-10'>
          <BoardHeader
            count='5 anchors'
            description='One path, five anchor points. Scroll to draw it; press P for every Bézier handle.'
            title='Journey'
          />
          <div className='mt-10'>
            <Journey chapters={chapters} media={media} />
          </div>
        </div>
      </Artboard>

      <Artboard id='experience' name='Experience by kind' page='About'>
        <div className='p-6 sm:p-10'>
          <BoardHeader
            count={experiences.reduce((n, c) => n + c.positions.length, 0)}
            description='Grouped like layers: work, freelance, research and the things I build on my own.'
            title='Experience by kind'
          />
          <div className='mt-8 grid gap-4 md:grid-cols-2'>
            {groupedExperience.map((group) => (
              <ExperienceGroup
                items={group.items}
                key={group.kind}
                label={group.label}
              />
            ))}
          </div>
        </div>
      </Artboard>

      <Artboard id='toolbox' name='Toolbox' page='About'>
        <div className='p-6 sm:p-10'>
          <BoardHeader
            count={hardware.length + software.length}
            description='The hardware and software I use every day, as a component library.'
            title='Toolbox'
          />
          <section
            className='mt-8'
            data-layer='Hardware'
            data-layer-type='group'
          >
            <h3 className='ab-t-label mb-4 text-(--muted)'>
              Hardware · {hardware.length} components
            </h3>
            <HardwareGrid items={hardware} />
          </section>
          <section
            className='mt-12'
            data-layer='Software'
            data-layer-type='group'
          >
            <h3 className='ab-t-label mb-4 text-(--muted)'>
              Software · {software.length} components · ◆ featured
            </h3>
            <SoftwareGrid items={software} />
          </section>
        </div>
      </Artboard>
    </>
  )
}
