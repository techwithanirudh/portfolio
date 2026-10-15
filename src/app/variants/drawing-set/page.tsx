import { ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getWork,
  getWriting,
  groupedExperience,
  profile,
  testimonials,
} from '../_shared/profile'
import { AskSimbaButton } from './_components/ask-simba-button'
import { Bom } from './_components/bom'
import { CopyButton } from './_components/copy-button'
import { BASE, firstRevision, pad, revisions } from './_components/data'
import { ExperienceItem } from './_components/experience-item'
import { Hero } from './_components/hero'
import { NoteBox } from './_components/note-box'
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelMeta,
  PanelTitle,
  PanelTitleSup,
} from './_components/panel'
import { RevisionStrip } from './_components/revision-table'
import { SectionDivider } from './_components/section-divider'
import { SheetHeader } from './_components/sheet-header'
import { TitleBlock } from './_components/title-block'
import { WritingList } from './_components/writing-list'

export const metadata: Metadata = { title: 'Home' }

const listFormat = new Intl.ListFormat('en', { type: 'conjunction' })

/** How the teaser names each team, from the position's type in the data. */
const teamPhrase = (type: string | undefined, title: string) => {
  if (type === 'Freelance') {
    return 'freelance work for'
  }
  if (type === 'Internship') {
    return 'an internship at'
  }
  return `a ${title.toLowerCase()} with`
}

const FULL_STACK = /full stack/i
const SELECTED = 4
const EMPLOYERS = 3

function SheetLink({ children, href }: { children: string; href: string }) {
  return (
    <Link
      className='group inline-flex items-center gap-1.5 text-(--ink) hover:text-(--accent)'
      href={href}
    >
      {children}
      <ArrowRightIcon
        aria-hidden
        className='size-3 transition-transform group-hover:translate-x-0.5'
      />
    </Link>
  )
}

export default function DrawingSetHome() {
  const work = getWork()
  const writing = getWriting()
  const latest = work.toSorted((a, b) => b.date.getTime() - a.date.getTime())[0]
  const employers = groupedExperience.flatMap((group) => group.items)
  const fullStackSince = revisions.find((r) => FULL_STACK.test(r.title))?.year
  const pastTeams = listFormat.format(
    revisions
      .filter((r) => r.company && !r.isCurrent)
      .map((r) => `${teamPhrase(r.type, r.title)} ${r.company?.name}`)
  )

  return (
    <>
      <SheetHeader code='A-01' />
      <Hero latest={latest} />

      <SectionDivider label='About' n={2} />
      <Panel aria-labelledby='ds-about' id='about'>
        <PanelHeader>
          <PanelTitle id='ds-about'>About</PanelTitle>
          <PanelMeta>
            Revisions {firstRevision.letter}–{revisions.at(-1)?.letter}
            <span className='text-(--ink-faint)'>·</span>
            <SheetLink href={`${BASE}/about`}>Sheet A-02</SheetLink>
          </PanelMeta>
        </PanelHeader>
        <div className='grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'>
          <PanelContent className='border-(--line) border-dashed max-md:border-b md:border-r'>
            <div className='max-w-[56ch] space-y-3 text-[17px] leading-relaxed'>
              <p>
                It started with Lego and Mindstorms in {firstRevision.year},
                then Python and AI, then the web, and it has been full stack
                since {fullStackSince}.
              </p>
              <p className='text-(--ink-muted)'>Along the way: {pastTeams}.</p>
              <p className='text-(--ink-muted)'>
                Now a {profile.current.title} at {profile.current.company},
                where AI generates, edits and animates SVGs.
              </p>
            </div>
            <p className='ds-label mt-6'>
              <SheetLink href={`${BASE}/about`}>
                Read the revision history
              </SheetLink>
            </p>
          </PanelContent>
          <PanelContent className='flex flex-col justify-center gap-4 md:px-8'>
            <p className='ds-label'>Revision strip · oldest to current</p>
            <RevisionStrip />
          </PanelContent>
        </div>
      </Panel>

      <SectionDivider label='Work' n={3} />
      <Panel aria-labelledby='ds-work' id='work'>
        <PanelHeader>
          <PanelTitle id='ds-work'>
            Selected work
            <PanelTitleSup>({work.length})</PanelTitleSup>
          </PanelTitle>
          <PanelMeta>
            Items 01–{pad(SELECTED)} of {pad(work.length)}
            <span className='text-(--ink-faint)'>·</span>
            <SheetLink href={`${BASE}/work`}>Full BOM, A-03</SheetLink>
          </PanelMeta>
        </PanelHeader>
        <Bom items={work.slice(0, SELECTED)} variant='compact' />
      </Panel>

      <SectionDivider label='Experience' n={4} />
      <Panel aria-labelledby='ds-experience' id='experience'>
        <PanelHeader>
          <PanelTitle id='ds-experience'>
            Experience
            <PanelTitleSup>({employers.length})</PanelTitleSup>
          </PanelTitle>
          <PanelMeta>
            {EMPLOYERS} of {employers.length}
            <span className='text-(--ink-faint)'>·</span>
            <SheetLink href={`${BASE}/about#experience`}>All on A-02</SheetLink>
          </PanelMeta>
        </PanelHeader>
        <div className='px-4 md:px-6'>
          {employers.slice(0, EMPLOYERS).map((experience) => (
            <ExperienceItem experience={experience} key={experience.id} />
          ))}
        </div>
      </Panel>

      <SectionDivider label='Writing' n={5} />
      <Panel aria-labelledby='ds-writing' id='writing'>
        <PanelHeader>
          <PanelTitle id='ds-writing'>
            Writing
            <PanelTitleSup>({writing.length})</PanelTitleSup>
          </PanelTitle>
          <PanelMeta>
            Latest 3<span className='text-(--ink-faint)'>·</span>
            <Link
              className='group inline-flex items-center gap-1.5 text-(--ink) hover:text-(--accent)'
              href='/blog'
            >
              All posts, A-04
              <ArrowUpRightIcon aria-hidden className='size-3' />
            </Link>
          </PanelMeta>
        </PanelHeader>
        <WritingList posts={writing.slice(0, 3)} />
      </Panel>

      <SectionDivider label='Notes' n={6} />
      <Panel aria-labelledby='ds-notes' id='notes'>
        <PanelHeader>
          <PanelTitle id='ds-notes'>
            Notes
            <PanelTitleSup>({testimonials.length})</PanelTitleSup>
          </PanelTitle>
          <PanelMeta>From people he has worked with</PanelMeta>
        </PanelHeader>
        <PanelContent className='md:py-8'>
          <NoteBox testimonials={testimonials} />
        </PanelContent>
      </Panel>

      <SectionDivider label='Contact' n={7} />
      <Panel aria-labelledby='ds-contact' id='contact'>
        <div className='grid md:grid-cols-[minmax(0,1fr)_auto]'>
          <div className='px-4 py-8 md:px-6 md:py-10'>
            <p className='ds-label mb-3'>Correspondence</p>
            <h2 className='sr-only' id='ds-contact'>
              Contact
            </h2>
            <div className='flex flex-wrap items-center gap-x-4 gap-y-3'>
              <a
                className='ds-link font-semibold text-[clamp(1.5rem,4vw,2.75rem)] leading-tight tracking-[-0.03em] [overflow-wrap:normal]'
                href={`mailto:${profile.email}`}
              >
                {profile.email}
              </a>
              <CopyButton label='Copy email address' value={profile.email} />
            </div>
            <p className='mt-3 max-w-[52ch] text-(--ink-muted)'>
              For work, collaborations or a question about something he built.
              Based in {profile.location}, on IST.
            </p>
          </div>
          <div className='flex flex-col justify-center gap-4 border-(--line) border-dashed px-4 py-6 max-md:border-t md:min-w-72 md:border-l md:px-6'>
            <AskSimbaButton />
            <ul className='grid grid-cols-2 gap-x-6 gap-y-2'>
              {profile.socials
                .filter((s) => s.url.startsWith('http'))
                .map((social) => (
                  <li key={social.name}>
                    <a
                      className='group inline-flex items-center gap-1 text-(--ink-muted) text-sm hover:text-(--ink)'
                      href={social.url}
                      rel='noopener'
                      target='_blank'
                    >
                      {social.name}
                      <ArrowUpRightIcon
                        aria-hidden
                        className='size-3 text-(--ink-faint) group-hover:text-current'
                      />
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Panel>

      <TitleBlock code='A-01' />
    </>
  )
}
