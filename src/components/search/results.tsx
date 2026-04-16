'use client'

import { createMarkdownRenderer } from 'fumadocs-core/content/md'
import { Fragment } from 'react'
import rehypeRaw from 'rehype-raw'
import { visit } from 'unist-util-visit'
import { Icons } from '@/components/icons/icons'
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import type { SearchTagGroup } from '@/types/search/results'

function rehypeCustomElements() {
  return (tree: Parameters<typeof visit>[0]) => {
    visit(tree, (node: { type: string; tagName?: string }) => {
      if (
        node.type === 'element' &&
        node.tagName &&
        document.createElement(node.tagName) instanceof HTMLUnknownElement
      ) {
        node.tagName = 'span'
      }
    })
  }
}

const md = createMarkdownRenderer({
  remarkRehypeOptions: { allowDangerousHtml: true },
  rehypePlugins: [rehypeRaw, rehypeCustomElements],
})

interface SearchResultsProps {
  groups: SearchTagGroup[]
  onSelect: (url: string) => void
}

export function SearchResults({ groups, onSelect }: SearchResultsProps) {
  return (
    <>
      {groups.map(({ tag, pages }) => (
        <Fragment key={tag}>
          <CommandSeparator />
          <CommandGroup heading={tag === 'blog' ? 'Blog' : 'Projects'}>
            {pages.map((group) => (
              <div key={group.page.id}>
                <CommandItem
                  className='font-medium'
                  onSelect={() => onSelect(group.page.url)}
                  value={group.page.id}
                >
                  {tag === 'blog' ? (
                    <Icons.blog className='size-4 text-muted-foreground' />
                  ) : (
                    <Icons.work className='size-4 text-muted-foreground' />
                  )}
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
