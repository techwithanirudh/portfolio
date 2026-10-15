// Adapted from victoreke.com/app/components/pages/Heroes.tsx and
// app/components/shared/EasterEgg.tsx (MIT, © 2023 Victor Eke). See ../NOTICES.md
import { cn } from '@/lib/utils'
import { people } from './notes'

/** A box drawn in ballpoint, ticked when met. */
function HandCheckbox({ checked }: { checked: boolean }) {
  return (
    <svg
      aria-hidden
      className='fn-ink-stroke size-6 shrink-0 text-[var(--fn-pen)]'
      strokeWidth='1.5'
      viewBox='0 0 24 24'
    >
      <path
        className={cn(!checked && 'text-[var(--fn-muted)]')}
        d='M4.4 5.2c4.8-.6 10-.8 15-.3.4 4.8.5 9.6.1 14.4-4.9.4-9.9.3-14.8 0-.6-4.6-.6-9.4-.3-14.1z'
        stroke={checked ? 'currentColor' : 'var(--fn-muted)'}
      />
      {checked ? (
        <path
          d='M7.2 12.4c1.4 1.2 2.6 2.6 3.6 4.2 2.4-4.6 5.4-8.8 9.6-12.8'
          strokeWidth='2'
        />
      ) : null}
    </svg>
  )
}

/**
 * Victor Eke's "Heroes" checklist, reframed as people Anirudh would like to
 * meet or already has. The names are placeholders for him to fill in.
 */
export function People() {
  return (
    <section aria-labelledby='fn-people'>
      <p className='fn-label mb-2'>04 · People</p>
      <h2
        className='fn-serif text-[2.1rem] leading-[1.05] sm:text-[2.6rem]'
        id='fn-people'
      >
        People I’d like to meet
      </h2>
      <p className='fn-measure mt-4 text-[var(--fn-muted)]'>
        Inspired by{' '}
        <a
          className='fn-link'
          href='https://victoreke.com/about'
          rel='noopener'
          target='_blank'
        >
          Victor Eke’s
        </a>{' '}
        heroes list: people whose work taught me something, and whom I’d love to
        meet someday. A tick means we have met.{' '}
        <strong className='font-medium text-[var(--fn-ink)]'>
          In no particular order.
        </strong>
      </p>
      <ul className='mt-8 grid gap-x-8 gap-y-1 sm:grid-cols-2'>
        {people.map((person) => (
          <li
            className='flex items-center gap-3 border-[var(--fn-rule)] border-b border-dashed py-2.5'
            key={person.name}
          >
            <HandCheckbox checked={person.met} />
            <span className='sr-only'>
              {person.met ? 'Met: ' : 'Not met yet: '}
            </span>
            <span className='fn-placeholder-chip whitespace-normal'>
              {person.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
