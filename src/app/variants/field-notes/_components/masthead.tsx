import Link from 'next/link'
import { profile } from '../../_shared/profile'
import { NavLinks } from './nav-links'
import { base } from './notes'
import { ThemeToggle } from './theme-toggle'

/** The notebook's cover strip: name on the left, pages on the right. */
export function Masthead() {
  return (
    <header className='relative z-10 border-[var(--fn-rule)] border-b'>
      <div className='fn-wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4'>
        <Link
          aria-label={`${profile.name}, field notes home`}
          className='group flex items-baseline gap-2.5 rounded-sm'
          href={base}
        >
          <span className='fn-serif text-[1.45rem] leading-none'>
            {profile.name}
          </span>
          <span className='fn-hand text-[1.2rem] leading-none transition-transform duration-300 group-hover:-rotate-3'>
            field notes
          </span>
        </Link>
        <div className='flex items-center gap-1 sm:gap-3'>
          <NavLinks />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
