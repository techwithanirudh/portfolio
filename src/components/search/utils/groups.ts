'use client'

import { defaultFilter } from 'cmdk'
import type { SortedResult } from 'fumadocs-core/search'
import type { PageEntry } from '@/app/actions/pages'
import { commands } from '@/constants/search'
import type { SearchPageGroup, SearchTagGroup } from '@/types/search/results'

function tagFromUrl(url: string): string {
  if (url.startsWith('/blog')) {
    return 'blog'
  }
  if (url.startsWith('/work')) {
    return 'projects'
  }
  return 'other'
}

const TAG_ORDER = ['blog', 'projects']

function orderTagGroups(tagMap: Map<string, SearchPageGroup[]>) {
  return TAG_ORDER.filter((tag) => tagMap.has(tag))
    .map((tag) => ({ tag, pages: tagMap.get(tag)! }))
    .concat(
      Array.from(tagMap.entries())
        .filter(([tag]) => !TAG_ORDER.includes(tag))
        .map(([tag, pages]) => ({ tag, pages }))
    )
}

export function buildCommandGroups(search: string) {
  const isEmpty = !search.trim()

  return commands
    .map(({ group, items }) => ({
      group,
      items: items.filter(
        (item) => isEmpty || defaultFilter(item.title, search, item.keywords) > 0
      ),
    }))
    .filter(({ items }) => items.length > 0)
}

export function buildSearchTagGroups(results: SortedResult[]): SearchTagGroup[] {
  const tagMap = new Map<string, SearchPageGroup[]>()
  let current: SearchPageGroup | null = null

  for (const result of results) {
    if (result.type === 'page') {
      const tag = tagFromUrl(result.url)
      if (!tagMap.has(tag)) {
        tagMap.set(tag, [])
      }

      current = {
        page: {
          content: String(result.content),
          id: result.id,
          url: result.url,
        },
        children: [],
      }
      tagMap.get(tag)!.push(current)
    } else if (current) {
      current.children.push(result)
    }
  }

  return orderTagGroups(tagMap)
}

export function buildPageEntryGroups(entries: PageEntry[]): SearchTagGroup[] {
  const tagMap = new Map<string, SearchPageGroup[]>()

  for (const entry of entries) {
    if (!tagMap.has(entry.tag)) {
      tagMap.set(entry.tag, [])
    }

    tagMap.get(entry.tag)!.push({
      page: {
        content: entry.title,
        id: entry.url,
        url: entry.url,
      },
      children: [],
    })
  }

  return orderTagGroups(tagMap)
}
