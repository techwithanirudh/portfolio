'use client'

import { createContext, use, type ReactNode } from 'react'
import type { PageEntry } from '@/app/actions/pages'

const PagesContext = createContext<PageEntry[]>([])

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
  return use(PagesContext)
}
