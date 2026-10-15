import { differenceInCalendarMonths } from 'date-fns'
import { Mail } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { experiences, profile } from '../../_shared/profile'
import { Counter } from '../_components/counter'
import { Dependencies } from '../_components/dependencies'
import { IncidentHistory } from '../_components/incident-history'
import { LiveTime } from '../_components/live-time'
import { Section } from '../_components/section'
import { StatusDot } from '../_components/status-dot'
import { StatusGroups } from '../_components/status-groups'
import { YearUptime } from '../_components/year-uptime'
import { getIncidents, START_YEAR, yearsBuilding } from '../_lib/timeline'

export const metadata: Metadata = {
  description:
    'Uptime since 2018: the journey as yearly uptime bars and incident history, experience by kind, and the tools Anirudh depends on.',
  title: 'About',
}

export default function StatusAbout() {
  const now = new Date()
  const incidents = getIncidents(now)
  const months = differenceInCalendarMonths(now, new Date(START_YEAR, 0, 1)) + 1
  const roles = experiences.flatMap((e) => e.positions).length
  const resolved = incidents.filter((i) => !i.ongoing).length

  const facts = [
    { label: 'Months logged', value: months },
    { label: 'Roles held', value: roles },
    { label: 'Incidents resolved', value: resolved },
    { label: 'Ongoing', value: incidents.length - resolved },
  ]

  return (
    <>
      <section
        aria-labelledby='about-title'
        className='vs-hero-glow border-[var(--line)] border-b'
      >
        <div className='mx-auto grid max-w-[1200px] gap-10 px-4 pt-12 pb-12 sm:px-6 md:pt-16 lg:grid-cols-12 lg:gap-12'>
          <div className='lg:col-span-7'>
            <p className='vs-label flex items-center gap-2'>
              <StatusDot pulse />
              Uptime since {START_YEAR}
            </p>
            <h1 className='sr-only' id='about-title'>
              About {profile.name}
            </h1>
            <p
              aria-hidden
              className='mt-4 flex items-baseline gap-3 font-semibold tracking-[-0.04em]'
            >
              <Counter
                className='vs-num text-[88px] leading-[0.9] sm:text-[120px]'
                value={yearsBuilding(now)}
              />
              <span className='text-[24px] text-[var(--muted)] tracking-[-0.02em] sm:text-[40px]'>
                years building
              </span>
            </p>
            <p className='sr-only'>{yearsBuilding(now)} years building.</p>
            <div className='mt-8 max-w-[60ch] space-y-4 text-[15px] text-[var(--muted)] leading-relaxed'>
              <p>
                <span className='text-[var(--text)]'>
                  I'm {profile.name}, a design engineer and full-stack developer
                  in {profile.location}.
                </span>{' '}
                It started with Lego and Mindstorms in {START_YEAR}, moved
                through Python and early AI, then the web, then full stack and
                open source.
              </p>
              <p>
                Since 2022 that has meant teams too: a research paper with
                Bosch, freelance work for MeetingBaaS, an internship at
                Energent.ai, and now {profile.current.title} at{' '}
                {profile.current.company}. The record below is the long version,
                kept the way a status page keeps it.
              </p>
            </div>
          </div>
          <aside className='lg:col-span-5'>
            <div className='vs-card overflow-hidden'>
              <div className='flex items-center gap-3 border-[var(--line)] border-b p-4 sm:p-5'>
                <Image
                  alt={`Portrait of ${profile.name}`}
                  className='size-12 rounded-xl bg-[var(--panel-raised)] object-cover'
                  height={96}
                  src={profile.avatar}
                  width={96}
                />
                <div className='min-w-0'>
                  <p className='font-medium text-[15px]'>{profile.name}</p>
                  <p className='vs-num text-[12px] text-[var(--muted)]'>
                    @{profile.handle} · <LiveTime />
                  </p>
                </div>
              </div>
              <dl className='grid grid-cols-2 gap-px bg-[var(--line)]'>
                {facts.map((f) => (
                  <div
                    className='bg-[var(--panel)] px-4 py-4 sm:px-5'
                    key={f.label}
                  >
                    <dt className='vs-label'>{f.label}</dt>
                    <dd className='vs-num mt-1 font-semibold text-[24px] tracking-tight'>
                      <Counter value={f.value} />
                    </dd>
                  </div>
                ))}
              </dl>
              <a
                className='flex items-center justify-between gap-3 border-[var(--line)] border-t px-4 py-3 text-[13px] transition-colors hover:bg-[var(--panel-raised)] sm:px-5'
                href={`mailto:${profile.email}`}
              >
                <span className='flex items-center gap-2'>
                  <Mail aria-hidden className='size-4 text-[var(--muted)]' />
                  {profile.email}
                </span>
                <span className='vs-label hidden sm:inline'>
                  [résumé: link needed]
                </span>
              </a>
            </div>
          </aside>
        </div>
      </section>

      <div className='mx-auto flex max-w-[1200px] flex-col gap-16 px-4 pt-12 sm:px-6 md:gap-20 md:pt-16'>
        <Section
          eyebrow='Every month since 2018'
          id='uptime'
          title='Uptime by year'
        >
          <YearUptime />
        </Section>

        <Section
          eyebrow={`${incidents.length} incidents · newest first`}
          id='incidents'
          title='Incident history'
        >
          <IncidentHistory incidents={incidents} />
        </Section>

        <Section eyebrow='Grouped by kind' id='experience' title='Experience'>
          <StatusGroups />
        </Section>

        <Section
          eyebrow='What this runs on'
          id='dependencies'
          title='Dependencies'
        >
          <Dependencies />
        </Section>
      </div>
    </>
  )
}
