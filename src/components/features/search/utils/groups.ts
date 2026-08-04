import { defaultFilter } from 'cmdk'
import type { SortedResult } from 'fumadocs-core/search'
import type { PageEntry } from '@/app/actions/pages'
import { commands } from '@/constants/search'
import type { SearchPageGroup, SearchTagGroup } from '@/types/search/results'

function tagFromUrl(url: string): string {
  if (url === '/blog' || url.startsWith('/blog/')) {
    return 'blog'
  }
  if (url === '/work' || url.startsWith('/work/')) {
    return 'projects'
  }
  return 'other'
}

const TAG_ORDER = ['blog', 'projects']

function orderTagGroups(
  tagMap: Map<string, SearchPageGroup[]>
): SearchTagGroup[] {
  return TAG_ORDER.filter((tag) => tagMap.has(tag))
    .map((tag) => ({ pages: tagMap.get(tag)!, tag }))
    .concat(
      Array.from(tagMap.entries())
        .filter(([tag]) => !TAG_ORDER.includes(tag))
        .map(([tag, pages]) => ({ pages, tag }))
    )
}

function groupSearchResultsByPage(results: SortedResult[]): SearchPageGroup[] {
  const grouped: SearchPageGroup[] = []
  let current: SearchPageGroup | null = null

  for (const result of results) {
    if (result.type === 'page') {
      current = {
        children: [],
        page: {
          content: String(result.content),
          id: result.id,
          url: result.url,
        },
      }
      grouped.push(current)
      continue
    }

    current?.children.push(result)
  }

  return grouped
}

function bucketPageGroupsByTag(
  pages: SearchPageGroup[],
  getTag: (page: SearchPageGroup) => string
): SearchTagGroup[] {
  const tagMap = new Map<string, SearchPageGroup[]>()

  for (const page of pages) {
    const tag = getTag(page)
    const existing = tagMap.get(tag)

    if (existing) {
      existing.push(page)
      continue
    }

    tagMap.set(tag, [page])
  }

  return orderTagGroups(tagMap)
}

export function buildCommandGroups(
  search: string,
  accountItems: CommandItem[] = []
) {
  const isEmpty = !search.trim()
  const commandGroups = commands
    .map(({ group, position, items }) => ({
      group,
      items: items.filter(
        (item) =>
          isEmpty || defaultFilter(item.title, search, item.keywords) > 0
      ),
      position,
    }))
    .filter(({ items }) => items.length > 0)

  if (accountItems.length === 0) {
    return commandGroups
  }

  const filteredAccountItems = accountItems.filter(
    (item) =>
      isEmpty || defaultFilter(item.title, search, item.keywords) > 0
  )

  return filteredAccountItems.length > 0
    ? [
        ...commandGroups,
        { group: 'Account', items: filteredAccountItems, position: 'after' as const },
      ]
    : commandGroups
}

export function buildSearchTagGroups(
  results: SortedResult[]
): SearchTagGroup[] {
  return bucketPageGroupsByTag(groupSearchResultsByPage(results), (page) =>
    tagFromUrl(page.page.url)
  )
}

export function buildPageEntryGroups(entries: PageEntry[]): SearchTagGroup[] {
  const tagMap = new Map<string, SearchPageGroup[]>()

  for (const entry of entries) {
    const existing = tagMap.get(entry.tag)
    const page: SearchPageGroup = {
      children: [],
      page: {
        content: entry.title,
        id: entry.url,
        url: entry.url,
      },
    }

    if (existing) {
      existing.push(page)
      continue
    }

    tagMap.set(entry.tag, [page])
  }

  return orderTagGroups(tagMap)
}
