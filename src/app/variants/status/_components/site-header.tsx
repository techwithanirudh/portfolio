import Link from 'next/link'
import { BASE } from '../_lib/routes'
import { type CommandData, CommandMenu } from './command-menu'
import { SiteNav } from './site-nav'
import { StatusDot } from './status-dot'
import { ThemeToggle } from './theme-toggle'

export function SiteHeader({ commands }: { commands: CommandData }) {
  return (
    <header className='sticky top-0 z-40 border-[var(--line)] border-b bg-[color-mix(in_srgb,var(--ground)_82%,transparent)] backdrop-blur-md'>
      <div className='mx-auto flex h-14 max-w-[1200px] items-center gap-2 px-4 sm:gap-4 sm:px-6'>
        <Link
          className='flex shrink-0 items-center gap-2.5 rounded-lg pr-1'
          href={BASE}
        >
          <span className='relative grid size-7 place-items-center rounded-lg bg-[var(--text)] text-[var(--ground)]'>
            <span className='font-semibold text-[13px] leading-none'>a</span>
            <StatusDot className='absolute -right-0.5 -bottom-0.5 ring-2 ring-[var(--ground)]' />
          </span>
          <span className='hidden flex-col leading-tight sm:flex'>
            <span className='font-semibold text-[13px]'>Anirudh Sriram</span>
            <span className='vs-num text-[11px] text-[var(--muted)]'>
              status
            </span>
          </span>
        </Link>
        <span
          aria-hidden
          className='hidden h-5 w-px bg-[var(--line)] sm:block'
        />
        <SiteNav />
        <div className='ml-auto flex items-center gap-1 sm:gap-2'>
          <CommandMenu data={commands} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
