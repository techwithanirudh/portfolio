'use client'

import { createContext, type ReactNode, use } from 'react'
import type { PageEntry } from '@/lib/source'

const PagesContext = createContext<PageEntry[] | null>(null)

export function PagesProvider({
  pages,
  children,
}: {
  pages: PageEntry[]
  children: ReactNode
}) {
  return <PagesContext value={pages}>{children}</PagesContext>
}

export function usePages(): PageEntry[] {
  const ctx = use(PagesContext)
  if (ctx === null) {
    throw new Error('usePages must be used within a PagesProvider')
  }
  return ctx
}
