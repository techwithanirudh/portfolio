import type { SortedResult } from 'fumadocs-core/search'

// TODO(slopradar): unused export: nothing imports SearchPage (only SearchPageGroup uses it), make it module-private
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
