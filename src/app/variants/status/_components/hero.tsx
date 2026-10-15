// Adapted from nelsonlai.dev/src/components/home/hero.tsx (MIT, © 2025 Nelson Lai). See ../NOTICES.md
import { ArrowRight, Mail, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { profile } from '../../_shared/profile'
import { BASE } from '../_lib/routes'
import { CareerStrip } from './career-strip'
import { LiveTime } from './live-time'
import { RotatingWord } from './rotating-word'
import { StatusDot } from './status-dot'

const WORDS = [
  'a design engineer',
  'a full-stack developer',
  'an agent builder',
  'an open-source maintainer',
] as const

/**
 * Nelson's hero layout (introduction left, avatar with a soft halo) turned
 * into a status summary: who, the rotating role word, and the career
 * uptime strip on the right.
 */
export function Hero() {
  return (
    <section
      aria-labelledby='hero-title'
      className='vs-hero-glow border-[var(--line)] border-b'
    >
      <div className='mx-auto grid max-w-[1200px] gap-10 px-4 pt-12 pb-12 sm:px-6 md:pt-16 lg:grid-cols-12 lg:gap-12 lg:pb-16'>
        <div className='flex flex-col justify-center lg:col-span-6'>
          <div className='flex items-center gap-3'>
            <div className='relative'>
              <Image
                alt={`Portrait of ${profile.name}`}
                className='size-14 rounded-2xl bg-[var(--panel-raised)] object-cover shadow-[var(--feature-card)]'
                height={112}
                priority
                src={profile.avatar}
                width={112}
              />
              <StatusDot className='absolute -right-1 -bottom-1 size-3! ring-[3px] ring-[var(--ground)]' />
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='vs-num text-[13px]'>@{profile.handle}</span>
              <span className='flex items-center gap-1.5 text-[12px] text-[var(--muted)]'>
                <MapPin aria-hidden className='size-3' />
                {profile.location} · <LiveTime className='vs-num text-[12px]' />
              </span>
            </div>
          </div>

          <h1
            className='mt-7 font-semibold text-[40px] leading-[1.05] tracking-[-0.035em] sm:text-[48px]'
            id='hero-title'
          >
            {profile.name}
          </h1>
          <p className='mt-3 font-medium text-[24px] text-[var(--muted)] leading-tight tracking-[-0.02em]'>
            Currently running as
            <RotatingWord words={WORDS} />
          </p>
          <p className='mt-5 max-w-[52ch] text-[15px] text-[var(--muted)] leading-relaxed'>
            I design and build web apps with Next.js, React and TypeScript, and
            publish templates and agents as open source. Right now I'm a{' '}
            <span className='text-[var(--text)]'>{profile.current.title}</span>{' '}
            at{' '}
            <a
              className='text-[var(--text)] underline decoration-[var(--line-strong)] underline-offset-4 transition-colors hover:decoration-[var(--text)]'
              href={profile.current.url}
              rel='noopener'
              target='_blank'
            >
              {profile.current.company}
            </a>
            , where AI generates, edits and animates SVGs.
          </p>
          <div className='mt-7 flex flex-wrap items-center gap-2.5'>
            <Link
              className='group inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--text)] px-4 font-medium text-[14px] text-[var(--ground)] transition-opacity hover:opacity-90'
              href={`${BASE}/work`}
            >
              View work
              <ArrowRight
                aria-hidden
                className='size-4 transition-transform group-hover:translate-x-0.5'
              />
            </Link>
            <a
              className='inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--panel)] px-4 font-medium text-[14px] shadow-[var(--feature-card)] transition-shadow hover:shadow-[var(--feature-card-hover)]'
              href={`mailto:${profile.email}`}
            >
              <Mail aria-hidden className='size-4 text-[var(--muted)]' />
              Contact
            </a>
          </div>
        </div>
        <div className='flex flex-col justify-center lg:col-span-6'>
          <CareerStrip />
        </div>
      </div>
    </section>
  )
}
