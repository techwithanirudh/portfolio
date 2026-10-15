// Adapted from victoreke.com/app/about/page.tsx (MIT, © 2023 Victor Eke) and
// jahir.dev/src/app/about/page.tsx (MIT, © 2022 Jahir Fiquitiva). See ../NOTICES.md
import { Download, ExternalLink, Mail } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import {
  chapters,
  experiences,
  groupedExperience,
  profile,
} from '../../_shared/profile'
import { PageHead } from '../_components/headings'
import { JourneyPath } from '../_components/journey-path'
import { firstLink, Logbook, toEntries } from '../_components/logbook'
import { Annotated, MarginNote } from '../_components/margin-note'
import { Mark } from '../_components/mark'
import { chapterPhotos } from '../_components/notes'
import { People } from '../_components/people'
import { TapedPhoto } from '../_components/taped-photo'
import { Usage } from '../_components/usage'

export const metadata = {
  title: 'About',
}

export default function FieldNotesAbout() {
  const socials = profile.socials.filter((s) => s.name !== 'Email')
  const groups = groupedExperience.filter((g) => g.items.length > 0)
  const paper = firstLink(
    experiences.find((e) => e.id === 'bosch')?.positions[0]?.description
  )
  const meetingbaas = experiences.find((e) => e.id === 'meetingbaas')
  const builtFor =
    (meetingbaas?.positions[0]?.description ?? '').split('](').length - 1
  const groupNotes: Partial<Record<string, ReactNode>> = {
    freelance: builtFor ? (
      <>
        {builtFor === 2 ? 'both' : 'all'} projects have write-ups on the Work
        page
      </>
    ) : null,
    personal: <>most of the Work page started here</>,
    research: paper ? (
      <>
        the preprint is on{' '}
        <a className='fn-link' href={paper.href} rel='noopener' target='_blank'>
          OSF
        </a>
      </>
    ) : null,
  }

  return (
    <>
      <PageHead no='02' title='About' />

      {/* Victor Eke's layout: bio on the left, a sticky aside on the right */}
      <section className='fn-wrap pt-14 sm:pt-20'>
        <div className='grid grid-cols-1 gap-x-16 lg:grid-cols-[1.25fr_1fr]'>
          <div className='order-2 lg:order-none'>
            <h1 className='fn-serif mb-8 text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.02] tracking-[-0.02em]'>
              I’m {profile.name}. I live in {profile.location}, where I{' '}
              <em className='italic'>build things for the web</em>.
            </h1>
            <div className='fn-measure space-y-5 text-[var(--fn-ink)]'>
              <p>
                I’m a self-taught software engineer and a student who loves
                building things with code. Right now I’m a{' '}
                {profile.current.title} at{' '}
                <a
                  className='fn-link'
                  href={profile.current.url}
                  rel='noopener'
                  target='_blank'
                >
                  {profile.current.company}
                </a>
                , a platform for generating, editing and animating SVG graphics
                with AI.
              </p>
              <p>
                It began with Lego sets: building, breaking and rebuilding
                anything I could imagine. That hands-on curiosity slowly turned
                into <Mark>a love for making things with code</Mark>, from
                robots and gadgets to websites and apps.
              </p>
              <p>
                Since then I’ve spent countless hours coding, brainstorming and
                wrestling with bugs that taught me more than any tutorial ever
                could. Most of it ends up on{' '}
                <a
                  className='fn-link'
                  href={`https://github.com/${profile.github}`}
                  rel='noopener'
                  target='_blank'
                >
                  GitHub
                </a>
                .
              </p>
            </div>

            {/* jahir.dev's "Let's connect!" */}
            <div className='mt-10'>
              <h2 className='font-medium text-[var(--fn-ink)]'>
                Let’s connect!
              </h2>
              <p className='mt-1 text-[var(--fn-muted)]'>
                Feel free to{' '}
                <a
                  className='fn-link text-[var(--fn-ink)]'
                  href={`mailto:${profile.email}?subject=Hi%20Anirudh!`}
                >
                  send me a message
                </a>
                , or find me on{' '}
                {socials.map((s, i) => (
                  <Fragment key={s.name}>
                    <a
                      className='fn-link text-[var(--fn-ink)]'
                      href={s.url}
                      rel='noopener'
                      target='_blank'
                    >
                      {s.name}
                    </a>
                    {i < socials.length - 2 ? ', ' : null}
                    {i === socials.length - 2 ? ' or ' : null}
                  </Fragment>
                ))}
                .
              </p>
            </div>
          </div>

          <aside className='order-none mb-14 flex flex-col gap-y-8 justify-self-start lg:order-1 lg:mb-0 lg:justify-self-center'>
            <div className='sticky top-10 w-[min(100%,320px)]'>
              <TapedPhoto
                className='mx-2 mb-8'
                index={1}
                priority
                sizes='320px'
                slot={{
                  alt: 'Simba the Shih Tzu, the site avatar',
                  caption: 'Simba, standing in for me',
                  kind: 'image',
                  src: profile.avatar,
                }}
                tape='corners'
                tiltScale={0.8}
              />
              <p className='fn-placeholder-chip mb-6 inline-block whitespace-normal'>
                [photo: a portrait of you, to sit beside Simba]
              </p>
              <div className='flex flex-col gap-y-4'>
                <div className='flex items-center gap-x-3'>
                  <a
                    className='fn-serif flex h-[46px] flex-1 items-center justify-center gap-x-2 rounded-[3px] border border-[var(--fn-rule)] bg-[var(--fn-card)] text-[1.25rem] shadow-[var(--fn-shadow)] transition-colors hover:border-[var(--fn-pen-soft)]'
                    href='/resume.pdf'
                    rel='noopener'
                    target='_blank'
                  >
                    View Résumé
                    <ExternalLink aria-hidden className='size-4' />
                  </a>
                  <a
                    aria-label='Download résumé'
                    className='grid size-[46px] place-items-center rounded-[3px] border border-[var(--fn-rule)] bg-[var(--fn-card)] text-[var(--fn-pen)] shadow-[var(--fn-shadow)] transition-colors hover:border-[var(--fn-pen-soft)]'
                    download='Anirudh-Sriram-resume.pdf'
                    href='/resume.pdf'
                    title='Download résumé'
                  >
                    <Download aria-hidden className='size-[18px]' />
                  </a>
                </div>
                <a
                  className='fn-link flex items-center gap-x-2 text-[15px]'
                  href={`mailto:${profile.email}`}
                >
                  <Mail aria-hidden className='size-4 text-[var(--fn-pen)]' />
                  {profile.email}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* The journey */}
      <section aria-labelledby='fn-journey' className='fn-wrap mt-24 sm:mt-32'>
        <Annotated
          note={
            <MarginNote
              arrow='down-left'
              className='lg:pt-12'
              decorative
              rotate={-3}
            >
              follow the dot, it keeps up as you scroll
            </MarginNote>
          }
        >
          <p className='fn-label mb-2'>01 · The journey</p>
          <h2
            className='fn-serif text-[2.1rem] leading-[1.05] sm:text-[2.6rem]'
            id='fn-journey'
          >
            How I got here
            <span className='fn-hand ml-3 inline-block -rotate-2 align-middle text-[1.35rem]'>
              2018 → now
            </span>
          </h2>
          <p className='fn-measure mt-4 text-[var(--fn-muted)]'>
            Five chapters, oldest first: from a box of Lego to a team where AI
            draws SVGs.
          </p>
        </Annotated>
        <div className='mt-10 lg:mt-4'>
          <JourneyPath
            chapters={chapters.map((c, i) => {
              const slot = chapterPhotos[c.id]
              return {
                body: c.body,
                id: c.id,
                photo: slot ? (
                  <TapedPhoto
                    aspect={slot.kind === 'image' ? '4 / 3' : '4 / 5'}
                    index={i + 2}
                    sizes='260px'
                    slot={slot}
                  />
                ) : null,
                title: c.title,
                years: c.years,
              }
            })}
          />
        </div>
      </section>

      {/* The logbook */}
      <section aria-labelledby='fn-logbook' className='fn-wrap mt-20 sm:mt-28'>
        <div className='max-w-[680px]'>
          <p className='fn-label mb-2'>02 · Experience</p>
          <h2
            className='fn-serif text-[2.1rem] leading-[1.05] sm:text-[2.6rem]'
            id='fn-logbook'
          >
            The logbook
          </h2>
          <p className='fn-measure mt-4 text-[var(--fn-muted)]'>
            Every role, grouped by kind, newest first.
          </p>
        </div>
        <div className='mt-10 space-y-14'>
          {groups.map((group) => {
            const entries = toEntries(group.items)
            return (
              <Annotated
                key={group.kind}
                note={
                  groupNotes[group.kind] ? (
                    <MarginNote
                      arrow='left'
                      className='lg:pt-16'
                      rotate={group.kind === 'research' ? 2 : -3}
                    >
                      {groupNotes[group.kind]}
                    </MarginNote>
                  ) : null
                }
              >
                <h3 className='mb-3 flex items-baseline gap-3'>
                  <span className='fn-hand -rotate-1 text-[2rem] leading-none'>
                    {group.label}
                  </span>
                  <span className='fn-label tabular-nums'>
                    {entries.length}{' '}
                    {entries.length === 1 ? 'entry' : 'entries'}
                  </span>
                </h3>
                <Logbook entries={entries} />
              </Annotated>
            )
          })}
        </div>
      </section>

      <div className='fn-wrap mt-24 sm:mt-32'>
        <div className='max-w-[860px]'>
          <Usage />
        </div>
      </div>

      <div className='fn-wrap mt-24 sm:mt-32'>
        <div className='max-w-[760px]'>
          <People />
        </div>
      </div>
    </>
  )
}
