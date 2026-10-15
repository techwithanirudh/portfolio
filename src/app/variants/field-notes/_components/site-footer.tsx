import Link from 'next/link'
import { Fragment } from 'react'
import { profile } from '../../_shared/profile'
import { AskSimba } from './ask-simba'
import { Annotated, MarginNote } from './margin-note'
import { SimbaDoodle } from './simba'

/**
 * Every page ends like a letter: a thank-you, the email, the socials, a
 * signature and Simba.
 */
export function SiteFooter() {
  const socials = profile.socials.filter((s) => s.name !== 'Email')

  return (
    <footer className='relative mt-24 border-[var(--fn-rule)] border-t sm:mt-32'>
      <div className='fn-wrap pt-14 pb-12 sm:pt-20'>
        <Annotated
          note={
            <MarginNote
              arrow='left'
              className='self-end pb-28'
              decorative
              rotate={-4}
            >
              Simba says hi
            </MarginNote>
          }
        >
          <p className='fn-label mb-3'>Sign-off</p>
          <h2
            className='fn-serif text-[2.3rem] leading-[1.05] sm:text-[3rem]'
            id='fn-signoff'
          >
            Thanks for reading.
          </h2>
          <p className='fn-measure mt-5 text-[var(--fn-muted)]'>
            If you are hiring, building something, or just want to say hello,
            the quickest way to reach me is a note to
          </p>
          <a
            className='fn-serif fn-link fn-link-pen mt-2 inline-block break-all text-[clamp(1.55rem,5vw,2.35rem)] italic leading-tight'
            href={`mailto:${profile.email}`}
          >
            {profile.email}
          </a>
          <p className='fn-measure mt-4 text-[var(--fn-muted)]'>
            or find me on{' '}
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
                {i === socials.length - 2 ? ' and ' : null}
              </Fragment>
            ))}
            .
          </p>
          <div className='mt-10 flex items-end justify-between gap-4'>
            <p className='fn-hand -rotate-3 whitespace-nowrap text-[2.8rem] leading-none sm:text-[3.8rem]'>
              — Anirudh
            </p>
            <div className='flex flex-col items-end gap-1 lg:flex-row lg:items-end lg:gap-2'>
              <span className='fn-hand -rotate-6 whitespace-nowrap text-[1.2rem] lg:hidden'>
                Simba says hi ↓
              </span>
              <SimbaDoodle className='size-20 -rotate-3 text-[var(--fn-pen)] sm:size-32' />
            </div>
          </div>
          <p className='mt-8 text-[15px] text-[var(--fn-muted)]'>
            P.S. Simba answers questions about my work too.{' '}
            <AskSimba>Ask Simba</AskSimba>.
          </p>
        </Annotated>
      </div>
      <div className='border-[var(--fn-rule)] border-t border-dashed'>
        <div className='fn-wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4'>
          <p className='fn-label'>Field notes · direction 02 of 04</p>
          <p className='fn-label flex gap-4'>
            <Link className='fn-link' href='/variants'>
              ← All four directions
            </Link>
            <Link className='fn-link' href='/'>
              Live site
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
