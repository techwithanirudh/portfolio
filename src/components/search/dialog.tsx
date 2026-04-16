'use client'

import { defaultFilter } from 'cmdk'
import { useDocsSearch } from 'fumadocs-core/search/client'
import type { SharedProps } from 'fumadocs-ui/components/dialog/search'
import { useI18n } from 'fumadocs-ui/contexts/i18n'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { getPages, type PageEntry } from '@/app/actions/pages'
import { Icons } from '@/components/icons/icons'
import { CommandMenuFooter } from '@/components/search/footer'
import { buildTagGroups, SearchResults } from '@/components/search/results'
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
import { commands } from '@/constants/search'
import type { CommandItem as CommandItemType } from '@/types/search'

function usePages(enabled: boolean): PageEntry[] {
  const [pages, setPages] = useState<PageEntry[]>([])
  useEffect(() => {
    if (!enabled) {
      return
    }
    getPages().then(setPages).catch(console.error)
  }, [enabled])
  return pages
}

export default function SearchDialog({ open, onOpenChange }: SharedProps) {
  const { locale } = useI18n()
  const router = useRouter()
  const { setTheme } = useTheme()

  const { search, setSearch, query } = useDocsSearch({ type: 'fetch', locale })
  const allPages = usePages(open ?? false)

  const isEmpty = !search.trim()

  const groups = useMemo(() => {
    if (isEmpty) {
      const pages = [
        {
          group: 'Projects',
          items: allPages
            .filter((p) => p.tag === 'projects')
            .map(
              (p): CommandItemType => ({
                kind: 'page',
                title: p.title,
                url: p.url,
                icon: <Icons.work className='size-4' />,
              })
            ),
        },
        {
          group: 'Blog',
          items: allPages
            .filter((p) => p.tag === 'blog')
            .map(
              (p): CommandItemType => ({
                kind: 'page',
                title: p.title,
                url: p.url,
                icon: <Icons.blog className='size-4' />,
              })
            ),
        },
      ].filter(({ items }) => items.length > 0)

      return [...commands, ...pages]
    }

    return commands
      .map(({ group, items }) => ({
        group,
        items: items.filter(
          (item) => defaultFilter(item.title, search, item.keywords) > 0
        ),
      }))
      .filter(({ items }) => items.length > 0)
  }, [isEmpty, search, allPages])

  const tagGroups = useMemo(() => {
    if (isEmpty || !query.data || query.data === 'empty') {
      return []
    }
    return buildTagGroups(query.data)
  }, [isEmpty, query.data])

  const hasNoResults =
    !(isEmpty || query.isLoading) &&
    tagGroups.length === 0 &&
    groups.length === 0

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

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className='top-0 flex max-w-full translate-y-0 flex-col rounded-none! p-0 sm:top-1/3 sm:max-w-lg sm:rounded-xl!'
        showCloseButton={false}
      >
        <DialogHeader className='sr-only'>
          <DialogTitle>Command Palette</DialogTitle>
          <DialogDescription>Search or jump to a page</DialogDescription>
        </DialogHeader>
        <Command shouldFilter={false}>
          <CommandInput
            onValueChange={setSearch}
            placeholder='Type a command or search...'
            value={search}
          />

          <CommandList
            className='max-h-[60dvh] supports-timeline-scroll:scroll-fade-effect-y sm:max-h-80'
            data-lenis-prevent
          >
            {groups.map(({ group, items }, i) => (
              <Fragment key={group}>
                {i > 0 && <CommandSeparator />}
                <CommandGroup heading={group}>
                  {items.map((item) => (
                    <CommandItem
                      key={item.title}
                      keywords={item.keywords}
                      onSelect={() => {
                        if (item.kind === 'theme') {
                          close()
                          setTheme(item.theme)
                        } else {
                          go(item.url, item.kind === 'link')
                        }
                      }}
                      value={item.title}
                    >
                      <span className='text-muted-foreground'>{item.icon}</span>
                      {item.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Fragment>
            ))}

            {!isEmpty && query.isLoading && (
              <div className='flex items-center justify-center py-6'>
                <Icons.spinner className='size-4 animate-spin text-muted-foreground' />
              </div>
            )}

            {hasNoResults && (
              <CommandEmpty>No results for &ldquo;{search}&rdquo;</CommandEmpty>
            )}

            {!isEmpty && <SearchResults groups={tagGroups} onSelect={go} />}
          </CommandList>

          <CommandMenuFooter />
        </Command>
      </DialogContent>
    </Dialog>
  )
}
