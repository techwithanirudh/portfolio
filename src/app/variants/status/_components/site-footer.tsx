import Link from 'next/link'
import { profile } from '../../_shared/profile'
import { BASE, navItems } from '../_lib/routes'
import { START_YEAR } from '../_lib/timeline'
import { StatusDot } from './status-dot'

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className='mt-24 border-[var(--line)] border-t bg-[var(--panel)]'>
      <div className='mx-auto grid max-w-[1200px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto]'>
        <div className='flex flex-col gap-3'>
          <p className='flex items-center gap-2.5 font-medium text-[15px]'>
            <StatusDot />
            {profile.name}
          </p>
          <p className='max-w-md text-[13px] text-[var(--muted)] leading-relaxed'>
            A status page for a person. Statuses, bars and incidents are derived
            from the dates in the experience and project data, not typed in by
            hand.
          </p>
          <p className='vs-num text-[12px] text-[var(--faint)]'>
            Uptime since {START_YEAR} · © {year} · {profile.handle}
          </p>
        </div>
        <nav
          aria-label='Footer'
          className='grid grid-cols-2 gap-x-10 gap-y-2 text-[13px] sm:grid-cols-3'
        >
          <p className='vs-label col-span-full mb-1'>Pages</p>
          {navItems.map((item) => (
            <Link
              className='text-[var(--muted)] transition-colors hover:text-[var(--text)]'
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className='text-[var(--muted)] transition-colors hover:text-[var(--text)]'
            href='/blog'
          >
            Blog
          </Link>
          <a
            className='text-[var(--muted)] transition-colors hover:text-[var(--text)]'
            href='/rss.xml'
          >
            RSS
          </a>
          <Link
            className='text-[var(--muted)] transition-colors hover:text-[var(--text)]'
            href='/variants'
          >
            All directions
          </Link>
        </nav>
      </div>
      <div className='border-[var(--line)] border-t'>
        <p className='vs-num mx-auto max-w-[1200px] px-4 py-3 text-[11px] text-[var(--faint)] sm:px-6'>
          Prototype 03 · Status · {BASE}
        </p>
      </div>
    </footer>
  )
}
