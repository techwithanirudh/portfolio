import type { SortedResult } from 'fumadocs-core/search'

export interface SearchPage {
  content: string
  id: string
  url: string
}

export interface SearchPageGroup {
  children: SortedResult[]
  page: SearchPage
}

export interface SearchTagGroup {
  pages: SearchPageGroup[]
  tag: string
}
