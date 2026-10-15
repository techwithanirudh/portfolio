import { format } from 'date-fns'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getWork, getWriting, profile } from '../_shared/profile'
import type { CommandData } from './_components/command-menu'
import { MotionProvider } from './_components/motion-provider'
import { SiteFooter } from './_components/site-footer'
import { SiteHeader } from './_components/site-header'
import { StatusHeader } from './_components/status-header'
import { deriveStatus, statusMeta } from './_lib/timeline'
import './variant.css'

export const metadata: Metadata = {
  title: {
    default: 'Status',
    template: '%s · Status',
  },
}

export default function StatusLayout({ children }: { children: ReactNode }) {
  const work = getWork()
  const newest = work.toSorted((a, b) => b.date.getTime() - a.date.getTime())[0]

  const commands: CommandData = {
    email: profile.email,
    posts: getWriting().map((p) => ({
      date: format(p.date, 'MMM yyyy'),
      title: p.title,
      url: p.url,
    })),
    projects: work.map((w) => ({
      status: statusMeta(deriveStatus(w))?.label ?? '',
      tags: w.tags,
      title: w.title,
      url: w.url,
    })),
    socials: profile.socials.filter((s) => s.url.startsWith('http')),
  }

  return (
    <div className='v-status flex min-h-svh flex-col font-sans text-[15px] antialiased'>
      <MotionProvider>
        <a
          className='sr-only z-50 rounded-lg bg-[var(--panel)] px-3 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3'
          href='#main'
        >
          Skip to content
        </a>
        <SiteHeader commands={commands} />
        <StatusHeader
          latest={
            newest
              ? {
                  title: newest.title,
                  url: newest.url,
                  when: format(newest.date, 'd MMM yyyy'),
                }
              : undefined
          }
        />
        <main className='flex-1' id='main'>
          {children}
        </main>
        <SiteFooter />
      </MotionProvider>
    </div>
  )
}
