'use client'

import { createMarkdownRenderer } from 'fumadocs-core/content/md'
import rehypeRaw from 'rehype-raw'
import { visit } from 'unist-util-visit'
import { Icons } from '@/components/icons/icons'
import { CommandGroup, CommandItem } from '@/components/ui/command'
import type { SearchTagGroup } from '@/types/search/results'

function rehypeCustomElements() {
  return (tree: Parameters<typeof visit>[0]) => {
    visit(tree, (node: { type: string; tagName?: string }) => {
      if (
        node.type === 'element' &&
        node.tagName &&
        typeof document !== 'undefined' &&
        document.createElement(node.tagName) instanceof HTMLUnknownElement
      ) {
        node.tagName = 'span'
      }
    })
  }
}

const md = createMarkdownRenderer({
  rehypePlugins: [rehypeRaw, rehypeCustomElements],
  remarkRehypeOptions: { allowDangerousHtml: true },
})

function Highlighted({ children }: { children: string }) {
  return (
    <md.Markdown
      components={{
        mark: ({ children: marked }) => (
          <mark className='bg-primary/20 px-0.5 text-primary not-italic'>
            {marked}
          </mark>
        ),
        p: ({ children: text }) => <span>{text}</span>,
      }}
    >
      {children}
    </md.Markdown>
  )
}

interface SearchResultsProps {
  groups: SearchTagGroup[]
  onSelect: (url: string) => void
}

export function SearchResults({ groups, onSelect }: SearchResultsProps) {
  return (
    <>
      {groups.map(({ tag, pages }) => (
        <CommandGroup heading={tag === 'blog' ? 'Blog' : 'Projects'} key={tag}>
          {pages.map((group) => (
            <div key={group.page.id}>
              <CommandItem
                onSelect={() => onSelect(group.page.url)}
                value={group.page.id}
              >
                {tag === 'blog' ? <Icons.blog /> : <Icons.work />}
                <p className='line-clamp-1'>
                  <Highlighted>{String(group.page.content)}</Highlighted>
                </p>
              </CommandItem>
              {group.children.map((child) => (
                <CommandItem
                  className='pl-9! text-muted-foreground'
                  key={child.id}
                  onSelect={() => onSelect(child.url)}
                  value={child.id}
                >
                  <p className='line-clamp-1'>
                    <Highlighted>{String(child.content)}</Highlighted>
                  </p>
                </CommandItem>
              ))}
            </div>
          ))}
        </CommandGroup>
      ))}
    </>
  )
}
