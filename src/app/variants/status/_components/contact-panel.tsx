import { ArrowRight, Mail } from 'lucide-react'
import { profile } from '../../_shared/profile'
import { StatusDot } from './status-dot'

export function ContactPanel() {
  return (
    <section
      aria-labelledby='contact-title'
      className='vs-card vs-hero-glow relative overflow-hidden p-6 sm:p-8'
      id='contact'
    >
      <div className='grid gap-6 md:grid-cols-[1fr_auto] md:items-end'>
        <div>
          <p className='flex items-center gap-2 text-[13px] text-[var(--muted)]'>
            <StatusDot pulse />
            Inbox operational
          </p>
          <h2
            className='mt-3 font-semibold text-[24px] tracking-tight'
            id='contact-title'
          >
            Open a ticket
          </h2>
          <p className='mt-2 max-w-[48ch] text-[15px] text-[var(--muted)] leading-relaxed'>
            For work, a project, or a question about something I built, email is
            the fastest route.
          </p>
        </div>
        <a
          className='group inline-flex h-11 items-center gap-2.5 rounded-xl bg-[var(--text)] px-4 font-medium text-[14px] text-[var(--ground)] transition-opacity hover:opacity-90'
          href={`mailto:${profile.email}`}
        >
          <Mail aria-hidden className='size-4' />
          {profile.email}
          <ArrowRight
            aria-hidden
            className='size-4 transition-transform group-hover:translate-x-0.5'
          />
        </a>
      </div>
    </section>
  )
}
