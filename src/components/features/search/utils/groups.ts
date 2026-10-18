import { defaultFilter } from 'cmdk'
import type { SortedResult } from 'fumadocs-core/search'
import { commands } from '@/constants/search'
import type { PageEntry } from '@/lib/source'
import type { CommandItem } from '@/types/search'
import type { SearchPageGroup, SearchTagGroup } from '@/types/search/results'
import { TAG_ORDER, tagFromUrl } from './tags'

const tagRank = (tag: string) => {
  const rank = TAG_ORDER.indexOf(tag)
  return rank === -1 ? TAG_ORDER.length : rank
}

function orderTagGroups(
  tagMap: Map<string, SearchPageGroup[]>
): SearchTagGroup[] {
  return Array.from(tagMap, ([tag, pages]) => ({ pages, tag })).toSorted(
    (a, b) => tagRank(a.tag) - tagRank(b.tag)
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
          content: result.content,
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

function bucketByTag(
  entries: { page: SearchPageGroup; tag: string }[]
): SearchTagGroup[] {
  const buckets = Map.groupBy(entries, (entry) => entry.tag)
  return orderTagGroups(
    new Map(
      Array.from(buckets, ([tag, tagEntries]) => [
        tag,
        tagEntries.map((entry) => entry.page),
      ])
    )
  )
}

export function buildCommandGroups(
  search: string,
  accountItems: CommandItem[] = []
) {
  const isEmpty = !search.trim()
  const matchesSearch = (item: CommandItem) =>
    isEmpty || defaultFilter(item.title, search, item.keywords) > 0
  const commandGroups = commands
    .map(({ group, position, items }) => ({
      group,
      items: items.filter(matchesSearch),
      position,
    }))
    .filter(({ items }) => items.length > 0)

  if (accountItems.length === 0) {
    return commandGroups
  }

  const filteredAccountItems = accountItems.filter(matchesSearch)

  return filteredAccountItems.length > 0
    ? [
        {
          group: 'Account',
          items: filteredAccountItems,
          position: 'after' as const,
        },
        ...commandGroups,
      ]
    : commandGroups
}

export function buildSearchTagGroups(
  results: SortedResult[]
): SearchTagGroup[] {
  return bucketByTag(
    groupSearchResultsByPage(results).map((page) => ({
      page,
      tag: tagFromUrl(page.page.url),
    }))
  )
}

export function buildPageEntryGroups(entries: PageEntry[]): SearchTagGroup[] {
  return bucketByTag(
    entries.map((entry) => ({
      page: {
        children: [],
        page: {
          content: entry.title,
          id: entry.url,
          url: entry.url,
        },
      },
      tag: entry.tag,
    }))
  )
}
