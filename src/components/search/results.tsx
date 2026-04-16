'use client'

import type { SortedResult } from 'fumadocs-core/search'
import { Fragment } from 'react'
import { Icons } from '@/components/icons/icons'
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'

const MARK_SPLIT = /(<mark>[^<]*<\/mark>)/g
const MARK_MATCH = /^<mark>(.*)<\/mark>$/

function Highlight({ content }: { content: string }) {
  const parts = content.split(MARK_SPLIT)
  if (parts.length === 1) {
    return <span>{content}</span>
  }

  return (
    <span>
      {parts.map((part, i) => {
        const match = part.match(MARK_MATCH)
        return match ? (
          <mark
            className='rounded-sm bg-primary/20 px-0.5 text-primary not-italic'
            // biome-ignore lint/suspicious/noArrayIndexKey: stable within a single render
            key={i}
          >
            {match[1]}
          </mark>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: stable within a single render
          <span key={i}>{part}</span>
        )
      })}
    </span>
  )
}

interface PageGroup {
  children: SortedResult[]
  page: SortedResult
}

interface TagGroup {
  pages: PageGroup[]
  tag: string
}

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

export function buildTagGroups(results: SortedResult[]): TagGroup[] {
  const tagMap = new Map<string, PageGroup[]>()
  let current: PageGroup | null = null

  for (const result of results) {
    if (result.type === 'page') {
      const tag = tagFromUrl(result.url)
      if (!tagMap.has(tag)) {
        tagMap.set(tag, [])
      }
      current = { page: result, children: [] }
      tagMap.get(tag)!.push(current)
    } else if (current) {
      current.children.push(result)
    }
  }

  return TAG_ORDER.filter((t) => tagMap.has(t))
    .map((tag) => ({ tag, pages: tagMap.get(tag)! }))
    .concat(
      Array.from(tagMap.entries())
        .filter(([t]) => !TAG_ORDER.includes(t))
        .map(([tag, pages]) => ({ tag, pages }))
    )
}

interface SearchResultsProps {
  groups: TagGroup[]
  onSelect: (url: string) => void
}

export function SearchResults({ groups, onSelect }: SearchResultsProps) {
  return (
    <>
      {groups.map(({ tag, pages }) => (
        <Fragment key={tag}>
          <CommandSeparator />
          <CommandGroup
            heading={
              <span className='flex items-center gap-1.5'>
                {tag === 'blog' ? (
                  <Icons.blog className='size-3' />
                ) : (
                  <Icons.work className='size-3' />
                )}
                <span className='capitalize'>{tag}</span>
              </span>
            }
          >
            {pages.map((group) => (
              <div key={group.page.id}>
                <CommandItem
                  className='font-medium'
                  onSelect={() => onSelect(group.page.url)}
                  value={group.page.id}
                >
                  <Highlight content={String(group.page.content)} />
                </CommandItem>
                {group.children.map((child) => (
                  <CommandItem
                    className='pl-6 text-muted-foreground text-xs'
                    key={child.id}
                    onSelect={() => onSelect(child.url)}
                    value={child.id}
                  >
                    <Icons.arrowRight className='size-3 shrink-0' />
                    <span className='truncate'>
                      <Highlight content={String(child.content)} />
                    </span>
                  </CommandItem>
                ))}
              </div>
            ))}
          </CommandGroup>
        </Fragment>
      ))}
    </>
  )
}
