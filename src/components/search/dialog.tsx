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
import { COMMANDS, type StaticCommand } from '@/constants/search'

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

  const commandGroups = useMemo(() => {
    const filtered = isEmpty
      ? COMMANDS
      : COMMANDS.filter(
          (cmd) => defaultFilter(cmd.title, search, cmd.keywords) > 0
        )

    const map = new Map<string, StaticCommand[]>()
    for (const cmd of filtered) {
      if (!map.has(cmd.group)) {
        map.set(cmd.group, [])
      }
      map.get(cmd.group)!.push(cmd)
    }

    if (isEmpty) {
      for (const { tag, group, icon } of [
        {
          tag: 'projects' as const,
          group: 'Projects',
          icon: <Icons.work className='size-4' />,
        },
        {
          tag: 'blog' as const,
          group: 'Blog',
          icon: <Icons.blog className='size-4' />,
        },
      ]) {
        const items = allPages
          .filter((p) => p.tag === tag)
          .map(
            (p): StaticCommand => ({
              kind: 'page',
              id: p.url,
              title: p.title,
              url: p.url,
              group,
              icon,
            })
          )
        if (items.length) {
          map.set(group, items)
        }
      }
    }

    return map
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
    commandGroups.size === 0

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
      <DialogHeader className='sr-only'>
        <DialogTitle>Command Palette</DialogTitle>
        <DialogDescription>Search or jump to a page</DialogDescription>
      </DialogHeader>
      <DialogContent
        className='top-0 flex max-w-full translate-y-0 flex-col rounded-none! p-0 sm:top-1/3 sm:max-w-lg sm:rounded-xl!'
        showCloseButton={false}
      >
        <Command shouldFilter={false}>
          <CommandInput
            onValueChange={setSearch}
            placeholder='Type a command or search...'
            value={search}
          />

          <CommandList
            className='max-h-[60dvh] [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)] sm:max-h-80'
            data-lenis-prevent
          >
            {Array.from(commandGroups.entries()).map(([group, cmds], i) => (
              <Fragment key={group}>
                {i > 0 && <CommandSeparator />}
                <CommandGroup heading={group}>
                  {cmds.map((cmd) => (
                    <CommandItem
                      key={cmd.id}
                      keywords={cmd.keywords}
                      onSelect={() => {
                        if (cmd.kind === 'theme') {
                          close()
                          setTheme(cmd.theme)
                        } else {
                          go(cmd.url, cmd.kind === 'link')
                        }
                      }}
                      value={cmd.id}
                    >
                      <span className='text-muted-foreground'>{cmd.icon}</span>
                      {cmd.title}
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
