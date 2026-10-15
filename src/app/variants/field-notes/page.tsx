import Link from 'next/link'
import {
  experiences,
  getWork,
  getWriting,
  profile,
  testimonials,
} from '../_shared/profile'
import { PageHead, SectionHeading } from './_components/headings'
import { IndexCard } from './_components/index-card'
import { Logbook, toEntries } from './_components/logbook'
import { Annotated, MarginNote } from './_components/margin-note'
import { Mark } from './_components/mark'
import { base, homePhotos } from './_components/notes'
import { NowCard } from './_components/now-card'
import { PullQuote } from './_components/pull-quote'
import { Settle } from './_components/settle'
import { TapedPhoto } from './_components/taped-photo'
import { WritingList } from './_components/writing-list'

export const metadata = {
  title: 'Home',
}

export default function FieldNotesHome() {
  const work = getWork()
  const posts = getWriting().slice(0, 3)
  const entries = toEntries(
    experiences.filter((e) => e.id !== 'personal')
  ).slice(0, 3)
  const [quote] = testimonials

  return (
    <>
      <PageHead no='01' title='Home' />

      {/* A letter, not a hero */}
      <section aria-labelledby='fn-hello' className='fn-wrap pt-14 sm:pt-20'>
        <Annotated
          note={
            <MarginNote arrow='down-left' className='lg:pt-40' rotate={-3}>
              currently: interning at {profile.current.company}, more below
            </MarginNote>
          }
        >
          <h1 className='fn-display' id='fn-hello'>
            Hi, I’m <em className='italic'>Anirudh</em>.
          </h1>
          <div className='fn-measure mt-7 space-y-4 text-[1.15rem] leading-[1.6] sm:mt-9 sm:text-[1.3rem]'>
            <p>
              I’m a design engineer and full-stack developer in{' '}
              {profile.location} who designs and builds web apps with Next.js,
              React and TypeScript.
            </p>
            <p>
              It started with Lego robots in 2018 and turned into research,
              freelance work, two internships and a lot of{' '}
              <Mark>things shipped in the open</Mark>.
            </p>
          </div>
          <p className='mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px]'>
            <a
              className='fn-link fn-link-pen font-medium'
              href={`mailto:${profile.email}`}
            >
              Write to me
            </a>
            <Link className='fn-link' href={`${base}/about`}>
              How I got here
            </Link>
            <a className='fn-link' href='/resume.pdf'>
              Résumé (PDF)
            </a>
          </p>
        </Annotated>
      </section>

      {/* Photos taped under the letter */}
      <section aria-label='Photos' className='fn-wrap mt-16 sm:mt-20'>
        <div className='grid max-w-[860px] grid-cols-3 items-start gap-3 px-1 sm:gap-10 sm:px-4'>
          {homePhotos.map((slot, i) => (
            <Settle
              className={i === 1 ? 'mt-6 sm:mt-10' : ''}
              delay={0.08 * i}
              drag
              key={slot.caption}
            >
              <TapedPhoto
                index={i}
                priority={i === 0}
                sizes='(min-width: 1024px) 240px, 33vw'
                slot={slot}
              />
            </Settle>
          ))}
        </div>
        <p className='fn-label mt-6 max-w-[860px] text-right lg:pr-4'>
          <span className='hidden sm:inline'>
            Go on, they move. They also spring back.
          </span>
        </p>
      </section>

      {/* Now */}
      <div className='fn-wrap mt-16 sm:mt-20'>
        <div className='max-w-[680px]'>
          <Settle>
            <NowCard />
          </Settle>
        </div>
      </div>

      {/* Things I've made */}
      <section aria-labelledby='fn-made' className='fn-wrap mt-24 sm:mt-32'>
        <div className='max-w-[860px]'>
          <SectionHeading
            action={{ href: `${base}/work`, label: `All ${work.length}` }}
            id='fn-made'
            label='02 · Work'
            title='Things I’ve made'
          />
          <div className='grid gap-6 sm:grid-cols-2 sm:gap-8'>
            {work.slice(0, 4).map((item, i) => (
              <Settle className='flex' delay={0.06 * i} key={item.slug}>
                <IndexCard className='w-full' index={i} item={item} />
              </Settle>
            ))}
          </div>
        </div>
      </section>

      {/* Where I've been */}
      <section aria-labelledby='fn-been' className='fn-wrap mt-24 sm:mt-32'>
        <Annotated
          note={
            <MarginNote arrow='left' className='lg:pt-36' rotate={2}>
              plus a research paper with Bosch, in the full logbook
            </MarginNote>
          }
        >
          <SectionHeading
            action={{ href: `${base}/about#fn-logbook`, label: 'Full logbook' }}
            id='fn-been'
            label='03 · Experience'
            title='Where I’ve been'
          />
          <Logbook entries={entries} />
        </Annotated>
      </section>

      {/* Writing */}
      <section aria-labelledby='fn-writing' className='fn-wrap mt-24 sm:mt-32'>
        <div className='max-w-[680px]'>
          <SectionHeading
            action={{ href: '/blog', label: 'All posts' }}
            id='fn-writing'
            label='04 · Writing'
            title='Writing'
          />
          <WritingList posts={posts} />
        </div>
      </section>

      {/* Kind words */}
      {quote ? (
        <section aria-label='Kind words' className='fn-wrap mt-24 sm:mt-32'>
          <div className='max-w-[860px]'>
            <p className='fn-label mb-10 text-center'>05 · Kind words</p>
            <Settle>
              <PullQuote testimonial={quote} />
            </Settle>
          </div>
        </section>
      ) : null}
    </>
  )
}
