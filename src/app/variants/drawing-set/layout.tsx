import type { Metadata } from 'next'
import { Caveat } from 'next/font/google'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { MotionProvider } from './_components/motion-provider'
import { SiteHeader } from './_components/site-header'
import './variant.css'

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  description:
    'Direction 01: the portfolio as an engineering drawing set. Numbered sheets, a revision table for the career and a bill of materials for the work.',
  title: {
    default: 'Drawing Set',
    template: '%s · Drawing Set',
  },
}

/**
 * Drawing Set. One wrapper scopes every token (`.v-drawing-set`); the drafting
 * table is the wrapper's ground, and each page is a sheet laid on it.
 */
export default function DrawingSetLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className={cn('v-drawing-set font-sans', caveat.variable)}>
      <MotionProvider>
        <SiteHeader />
        <main className='px-2 lg:px-10'>
          <div className='ds-col' data-sheet-origin>
            {children}
          </div>
        </main>
      </MotionProvider>
    </div>
  )
}
