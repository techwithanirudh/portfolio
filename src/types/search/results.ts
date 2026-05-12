import type { SortedResult } from 'fumadocs-core/search'

export type SearchContentTag = 'blog' | 'projects'
export type ResolvedSearchTag = SearchContentTag | 'other'

export interface SearchPage {
  content: string
  id: string
  tag: ResolvedSearchTag
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
