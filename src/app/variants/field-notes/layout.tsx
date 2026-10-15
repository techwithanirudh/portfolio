import type { Metadata } from 'next'
import { Caveat, Instrument_Serif } from 'next/font/google'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Masthead } from './_components/masthead'
import { MotionProvider } from './_components/motion-provider'
import { SiteFooter } from './_components/site-footer'
import './variant.css'

const serif = Instrument_Serif({
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-fn-serif',
  weight: '400',
})

const hand = Caveat({
  subsets: ['latin'],
  variable: '--font-fn-hand',
})

export const metadata: Metadata = {
  title: {
    default: 'Field Notes',
    template: '%s · Field Notes',
  },
}

export default function FieldNotesLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className={cn('v-field-notes', serif.variable, hand.variable)}>
      <MotionProvider>
        <a
          className='fn-label sr-only z-50 rounded bg-[var(--fn-card)] px-3 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3'
          href='#fn-main'
        >
          Skip to content
        </a>
        <Masthead />
        <main className='relative' id='fn-main'>
          {children}
        </main>
        <SiteFooter />
      </MotionProvider>
    </div>
  )
}
