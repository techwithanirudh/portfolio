'use client'

import type { SortedResult } from 'fumadocs-core/search'
import { useDocsSearch } from 'fumadocs-core/search/client'
import type { SharedProps } from 'fumadocs-ui/components/dialog/search'
import { useI18n } from 'fumadocs-ui/contexts/i18n'
import { useRouter } from 'next/navigation'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { getPages, type PageEntry } from '@/app/actions/pages'
import { Icons } from '@/components/icons/icons'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { linkItems, socials } from '@/constants/navigation'

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
  tag: string
}

interface TagGroup {
  pages: PageGroup[]
  tag: string
}

const TAG_ORDER = ['blog', 'projects']

// Derive tag from URL since SortedResult doesn't expose the index tag field
function tagFromUrl(url: string): string {
  if (url.startsWith('/blog')) {
    return 'blog'
  }
  if (url.startsWith('/work')) {
    return 'projects'
  }
  return 'other'
}

// Simple substring match for filtering static items when searching
function matches(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase())
}

export default function CustomSearchDialog({
  open,
  onOpenChange,
}: SharedProps) {
  const { locale } = useI18n()
  const router = useRouter()

  const { search, setSearch, query } = useDocsSearch({ type: 'fetch', locale })
  const [allPages, setAllPages] = useState<PageEntry[]>([])

  useEffect(() => {
    if (!open) {
      return
    }
    getPages().then(setAllPages).catch(console.error)
  }, [open])

  const navLinks = useMemo(
    () =>
      linkItems.filter(
        (
          item
        ): item is typeof item & {
          url: string
          text: string
          icon?: ReactNode
        } => 'url' in item && 'text' in item && typeof item.url === 'string'
      ),
    []
  )

  const isEmpty = !search.trim()

  // Filter static items when searching
  const filteredNav = isEmpty
    ? navLinks
    : navLinks.filter((item) => matches(item.text, search))
  const filteredProjects = isEmpty
    ? allPages.filter((p) => p.tag === 'projects')
    : allPages.filter((p) => p.tag === 'projects' && matches(p.title, search))
  const filteredBlog = isEmpty
    ? allPages.filter((p) => p.tag === 'blog')
    : allPages.filter((p) => p.tag === 'blog' && matches(p.title, search))
  const filteredSocials = isEmpty
    ? socials
    : socials.filter((s) => matches(s.name, search))

  // Group Fumadocs full-text results by tag → pages → children
  const tagGroups = useMemo<TagGroup[]>(() => {
    if (isEmpty || !query.data || query.data === 'empty') {
      return []
    }

    const tagMap = new Map<string, PageGroup[]>()
    let current: PageGroup | null = null

    for (const result of query.data) {
      if (result.type === 'page') {
        const tag = tagFromUrl(result.url)
        if (!tagMap.has(tag)) {
          tagMap.set(tag, [])
        }
        current = { page: result, children: [], tag }
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
  }, [isEmpty, query.data])

  const close = () => {
    onOpenChange(false)
    setSearch('')
  }

  const go = (url: string, external = false) => {
    close()
    if (external) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      router.push(url)
    }
  }

  const hasStaticResults =
    filteredNav.length > 0 ||
    filteredProjects.length > 0 ||
    filteredBlog.length > 0 ||
    filteredSocials.length > 0
  const hasNoResults =
    !(isEmpty || query.isLoading) && tagGroups.length === 0 && !hasStaticResults

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogHeader className='sr-only'>
        <DialogTitle>Command Palette</DialogTitle>
        <DialogDescription>Search or jump to a page</DialogDescription>
      </DialogHeader>
      <DialogContent
        className='top-0 max-w-full translate-y-0 rounded-none! p-0 sm:top-1/3 sm:max-w-md sm:rounded-xl!'
        showCloseButton={false}
      >
        <Command shouldFilter={false}>
          <CommandInput
            onValueChange={setSearch}
            placeholder='Search or jump to...'
            value={search}
          />
          <CommandList
            className='max-h-[60dvh] [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)] sm:max-h-72'
            data-lenis-prevent
          >
            {filteredNav.length > 0 && (
              <CommandGroup heading='Navigation'>
                {filteredNav.map((item) => (
                  <CommandItem
                    key={item.url}
                    onSelect={() => go(item.url)}
                    value={item.text}
                  >
                    <span className='text-muted-foreground'>{item.icon}</span>
                    {item.text}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {isEmpty && filteredProjects.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading='Projects'>
                  {filteredProjects.map((p) => (
                    <CommandItem
                      key={p.url}
                      onSelect={() => go(p.url)}
                      value={p.title}
                    >
                      <Icons.work className='size-4 text-muted-foreground' />
                      {p.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {isEmpty && filteredBlog.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading='Blog'>
                  {filteredBlog.map((p) => (
                    <CommandItem
                      key={p.url}
                      onSelect={() => go(p.url)}
                      value={p.title}
                    >
                      <Icons.blog className='size-4 text-muted-foreground' />
                      {p.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {filteredSocials.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading='Socials'>
                  {filteredSocials.map((s) => (
                    <CommandItem
                      key={s.name}
                      onSelect={() => go(s.url, true)}
                      value={s.name}
                    >
                      <span className='text-muted-foreground'>{s.icon}</span>
                      {s.name}
                      <span className='ml-auto text-muted-foreground text-xs'>
                        {s.description}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {!isEmpty && query.isLoading && (
              <div className='flex items-center justify-center py-6'>
                <Icons.spinner className='size-4 animate-spin text-muted-foreground' />
              </div>
            )}

            {hasNoResults && (
              <CommandEmpty>No results for &ldquo;{search}&rdquo;</CommandEmpty>
            )}

            {!isEmpty &&
              tagGroups.map(({ tag, pages }) => (
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
                  key={tag}
                >
                  {pages.map((group) => (
                    <div key={group.page.id}>
                      <CommandItem
                        className='font-medium'
                        onSelect={() => go(group.page.url)}
                        value={group.page.id}
                      >
                        <Highlight content={String(group.page.content)} />
                      </CommandItem>
                      {group.children.map((child) => (
                        <CommandItem
                          className='pl-6 text-muted-foreground text-xs'
                          key={child.id}
                          onSelect={() => go(child.url)}
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
              ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
