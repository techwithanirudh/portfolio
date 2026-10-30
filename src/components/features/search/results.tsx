'use client'

import { createMarkdownRenderer } from 'fumadocs-core/content/md'
import type { Element, Root } from 'hast'
import { type ComponentProps, Fragment } from 'react'
import rehypeRaw from 'rehype-raw'
import { visit } from 'unist-util-visit'
import { getTagMeta } from '@/components/features/search/utils/tags'
import { Icons } from '@/components/icons/icons'
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import type { SearchTagGroup } from '@/types/search/results'

function rehypeCustomElements() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (
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

const markdownComponents: ComponentProps<typeof md.Markdown>['components'] = {
  mark: ({ children }) => (
    <mark className='rounded-sm bg-primary/20 px-0.5 text-primary not-italic'>
      {children}
    </mark>
  ),
  p: ({ children }) => <span>{children}</span>,
}

function TagIcon({ className, tag }: { className?: string; tag: string }) {
  const Icon = getTagMeta(tag).icon
  return <Icon className={className} />
}

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
          <CommandGroup heading={getTagMeta(tag).heading}>
            {pages.map((group) => (
              <div key={group.page.id}>
                <CommandItem
                  className='font-medium'
                  onSelect={() => onSelect(group.page.url)}
                  value={group.page.id}
                >
                  <TagIcon className='size-4 text-muted-foreground' tag={tag} />
                  <md.Markdown components={markdownComponents}>
                    {group.page.content}
                  </md.Markdown>
                </CommandItem>
                {group.children.map((child) => (
                  <CommandItem
                    className='pl-6 text-muted-foreground text-xs [&_svg:not([class*=size-])]:size-3'
                    key={child.id}
                    onSelect={() => onSelect(child.url)}
                    value={child.id}
                  >
                    <Icons.arrowRight className='size-3 shrink-0' />
                    <span className='truncate'>
                      <md.Markdown components={markdownComponents}>
                        {child.content}
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
