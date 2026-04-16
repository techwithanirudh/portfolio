'use client'

import { createMarkdownRenderer } from 'fumadocs-core/content/md'
import type { SortedResult } from 'fumadocs-core/search'
import { Fragment } from 'react'
import rehypeRaw from 'rehype-raw'
import { Icons } from '@/components/icons/icons'
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'

const md = createMarkdownRenderer({
  remarkRehypeOptions: { allowDangerousHtml: true },
  rehypePlugins: [rehypeRaw],
})

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
                  <md.Markdown
                    components={{
                      mark: ({ children }) => (
                        <mark className='rounded-sm bg-primary/20 px-0.5 text-primary not-italic'>
                          {children}
                        </mark>
                      ),
                      p: ({ children }) => <span>{children}</span>,
                    }}
                  >
                    {String(group.page.content)}
                  </md.Markdown>
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
                      <md.Markdown
                        components={{
                          mark: ({ children }) => (
                            <mark className='rounded-sm bg-primary/20 px-0.5 text-primary not-italic'>
                              {children}
                            </mark>
                          ),
                          p: ({ children }) => <span>{children}</span>,
                        }}
                      >
                        {String(child.content)}
                      </md.Markdown>
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
