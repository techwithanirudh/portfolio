'use client'

import { createContext, type ReactNode, use } from 'react'
import type { PageEntry } from '@/app/actions/pages'

const PagesContext = createContext<PageEntry[] | null>(null)

export function PagesProvider({
  pages,
  children,
}: {
  pages: PageEntry[]
  children: ReactNode
}) {
  return <PagesContext.Provider value={pages}>{children}</PagesContext.Provider>
}

export function usePages(): PageEntry[] {
  const ctx = use(PagesContext)
  if (ctx === null) {
    throw new Error('usePages must be used within a PagesProvider')
  }
  return ctx
}
