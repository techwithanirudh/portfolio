'use client'

import { PawPrint } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAssistantContext } from '@/components/features/assistant'
import { cn } from '@/lib/utils'
import { LayersSheet } from './layers-sheet'
import { pages } from './nav'

/** The variant's mark: a Bézier anchor with its two handles. */
function AnchorMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} fill='none' viewBox='0 0 24 24'>
      <path
        d='M4 18 C 8 6, 16 6, 20 18'
        stroke='var(--path)'
        strokeLinecap='round'
        strokeWidth='1.75'
      />
      <line
        stroke='currentColor'
        strokeWidth='1'
        x1='5'
        x2='19'
        y1='9'
        y2='9'
      />
      <circle
        cx='5'
        cy='9'
        fill='var(--board)'
        r='1.75'
        stroke='currentColor'
      />
      <circle
        cx='19'
        cy='9'
        fill='var(--board)'
        r='1.75'
        stroke='currentColor'
      />
      <rect fill='var(--path)' height='4' width='4' x='10' y='7' />
    </svg>
  )
}

function SimbaPresence() {
  const { setOpen } = useAssistantContext()
  return (
    <button
      aria-label='Ask Simba, the site’s AI chat'
      className='group relative grid size-7 place-items-center rounded-full bg-(--path) text-white ring-(--panel) ring-2'
      onClick={() => setOpen(true)}
      title='Simba is here. Ask him anything.'
      type='button'
    >
      <PawPrint aria-hidden className='size-3.5' strokeWidth={2} />
    </button>
  )
}

/**
 * The file's title bar: name and page on the left, page tabs in the middle,
 * collaborators and the one primary action (Contact) on the right.
 */
export function TitleBar({
  avatar,
  email,
  name,
}: {
  avatar: string
  email: string
  name: string
}) {
  const pathname = usePathname()
  const current = pages.find(
    (p) => pathname === p.href || pathname === `${p.href}/`
  )

  return (
    <header className='ab-bar flex items-center gap-2 px-2 md:px-3'>
      <Link
        className='flex min-w-0 items-center gap-2 rounded px-1 py-1'
        href={pages[0].href}
      >
        <AnchorMark className='size-6 flex-none text-(--ink)' />
        <span className='hidden min-w-0 truncate text-[12px] sm:block'>
          <span className='text-(--muted)'>{name} /</span>{' '}
          <span className='font-semibold'>portfolio</span>
          <span className='text-(--muted)'> · {current?.label ?? 'Home'}</span>
        </span>
      </Link>

      <nav
        aria-label='Pages'
        className='flex items-center gap-0.5 sm:absolute sm:left-1/2 sm:-translate-x-1/2'
      >
        {pages.map((page) => {
          const active = page.id === (current?.id ?? 'home')
          return (
            <Link
              aria-current={active ? 'page' : undefined}
              className={cn(
                'rounded-md px-2.5 py-1 text-[12px] transition-colors duration-100',
                active
                  ? 'bg-(--board) font-semibold text-(--ink) shadow-[0_0_0_1px_var(--panel-line)]'
                  : 'text-(--muted) hover:text-(--ink)'
              )}
              href={page.href}
              key={page.id}
            >
              {page.label}
            </Link>
          )
        })}
      </nav>

      <div className='ml-auto flex items-center gap-2'>
        <div className='hidden items-center md:flex'>
          <span className='relative block size-7 overflow-hidden rounded-full ring-(--sel) ring-2'>
            <Image
              alt={`${name}, editing`}
              className='object-cover'
              fill
              sizes='28px'
              src={avatar}
            />
          </span>
          <span className='-ml-1.5'>
            <SimbaPresence />
          </span>
        </div>
        <a
          className='ab-btn ab-btn-primary hidden h-7 px-3 text-[12px] md:inline-flex'
          href={`mailto:${email}`}
        >
          Contact
        </a>
        <LayersSheet />
      </div>
    </header>
  )
}
