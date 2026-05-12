import { defaultFilter } from 'cmdk'
import type { SortedResult } from 'fumadocs-core/search'
import type { PageEntry } from '@/app/actions/pages'
import { searchTagOrder } from '@/components/search/utils/tags'
import { commands } from '@/constants/search'
import type {
  ResolvedSearchTag,
  SearchContentTag,
  SearchPageGroup,
  SearchTagGroup,
} from '@/types/search/results'

function tagFromUrl(url: string): ResolvedSearchTag {
  if (url === '/blog' || url.startsWith('/blog/')) {
    return 'blog'
  }

  if (url === '/work' || url.startsWith('/work/')) {
    return 'projects'
  }

  return 'other'
}

function getPageUrl(url: string) {
  return url.split('#')[0] ?? url
}

function groupSearchResultsByPage(
  results: SortedResult[],
  tagMap: Map<string, SearchContentTag>
): SearchPageGroup[] {
  const grouped: SearchPageGroup[] = []
  let current: SearchPageGroup | null = null

  for (const result of results) {
    if (result.type === 'page') {
      current = {
        page: {
          content: String(result.content),
          id: result.id,
          tag: tagMap.get(getPageUrl(result.url)) ?? tagFromUrl(result.url),
          url: result.url,
        },
        children: [],
      }
      grouped.push(current)
      continue
    }

    current?.children.push(result)
  }

  return grouped
}

function bucketPageGroupsByTag(pages: SearchPageGroup[]): SearchTagGroup[] {
  const tagMap = new Map<string, SearchPageGroup[]>()

  for (const page of pages) {
    const tag = page.page.tag
    const existing = tagMap.get(tag)

    if (existing) {
      existing.push(page)
      continue
    }

    tagMap.set(tag, [page])
  }

  return [
    ...searchTagOrder
      .filter((tag) => tagMap.has(tag))
      .map((tag) => ({ tag, pages: tagMap.get(tag)! })),
    ...Array.from(tagMap.entries())
      .filter(([tag]) => !searchTagOrder.includes(tag as ResolvedSearchTag))
      .map(([tag, pages]) => ({ tag, pages })),
  ]
}

export function buildCommandGroups(search: string) {
  const isEmpty = !search.trim()

  return commands
    .map(({ group, position, items }) => ({
      group,
      position,
      items: items.filter(
        (item) =>
          isEmpty || defaultFilter(item.title, search, item.keywords) > 0
      ),
    }))
    .filter(({ items }) => items.length > 0)
}

export function buildSearchTagGroups(
  results: SortedResult[],
  entries: PageEntry[]
): SearchTagGroup[] {
  const tagMap = new Map(
    entries.map((entry) => [entry.url, entry.tag] as const)
  )

  return bucketPageGroupsByTag(groupSearchResultsByPage(results, tagMap))
}

export function buildPageEntryGroups(entries: PageEntry[]): SearchTagGroup[] {
  const pages = entries.map<SearchPageGroup>((entry) => ({
    page: {
      content: entry.title,
      id: entry.url,
      tag: entry.tag,
      url: entry.url,
    },
    children: [],
  }))

  return bucketPageGroupsByTag(pages)
}
