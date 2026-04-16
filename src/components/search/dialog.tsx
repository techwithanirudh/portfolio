'use client'

import { useDocsSearch } from 'fumadocs-core/search/client'
import type { SharedProps } from 'fumadocs-ui/components/dialog/search'
import { useI18n } from 'fumadocs-ui/contexts/i18n'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'
import { getPages, type PageEntry } from '@/app/actions/pages'
import { Icons } from '@/components/icons/icons'
import { CommandLinkGroup } from '@/components/search/command-link-group'
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
import {
  EXTRA_ITEMS,
  NAV_ITEMS,
  SOCIAL_ITEMS,
  THEME_ITEMS,
} from '@/constants/search'

function matches(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase())
}

export default function SearchDialog({ open, onOpenChange }: SharedProps) {
  const { locale } = useI18n()
  const router = useRouter()
  const { setTheme } = useTheme()

  const { search, setSearch, query } = useDocsSearch({ type: 'fetch', locale })
  const [allPages, setAllPages] = useState<PageEntry[]>([])

  useEffect(() => {
    if (!open) {
      return
    }
    getPages().then(setAllPages).catch(console.error)
  }, [open])

  const isEmpty = !search.trim()

  const filteredNav = isEmpty
    ? NAV_ITEMS
    : NAV_ITEMS.filter((item) => matches(item.title, search))

  const filteredSocials = isEmpty
    ? SOCIAL_ITEMS
    : SOCIAL_ITEMS.filter((item) => matches(item.title, search))

  const filteredExtras = isEmpty
    ? EXTRA_ITEMS
    : EXTRA_ITEMS.filter((item) => matches(item.title, search))

  const filteredTheme =
    isEmpty ||
    ['theme', 'light', 'dark', 'system', 'appearance'].some((kw) =>
      matches(kw, search)
    )

  const tagGroups = useMemo(() => {
    if (isEmpty || !query.data || query.data === 'empty') {
      return []
    }
    return buildTagGroups(query.data)
  }, [isEmpty, query.data])

  const hasNoResults =
    !(isEmpty || query.isLoading) &&
    tagGroups.length === 0 &&
    filteredNav.length === 0 &&
    filteredSocials.length === 0 &&
    filteredExtras.length === 0 &&
    !filteredTheme

  const close = () => {
    onOpenChange(false)
    setSearch('')
  }

  const go = (url: string, openInNewTab = false) => {
    close()
    if (openInNewTab) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      router.push(url)
    }
  }

  const runTheme = (theme: 'light' | 'dark' | 'system') => {
    close()
    setTheme(theme)
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
            <CommandLinkGroup
              heading='Navigation'
              links={filteredNav}
              onSelect={go}
            />

            {isEmpty && (
              <>
                {allPages.filter((p) => p.tag === 'projects').length > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup heading='Projects'>
                      {allPages
                        .filter((p) => p.tag === 'projects')
                        .map((p) => (
                          <CommandItem
                            key={p.url}
                            onSelect={() => go(p.url)}
                            value={p.url}
                          >
                            <span className='text-muted-foreground'>
                              <Icons.work className='size-4' />
                            </span>
                            {p.title}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </>
                )}

                {allPages.filter((p) => p.tag === 'blog').length > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup heading='Blog'>
                      {allPages
                        .filter((p) => p.tag === 'blog')
                        .map((p) => (
                          <CommandItem
                            key={p.url}
                            onSelect={() => go(p.url)}
                            value={p.url}
                          >
                            <span className='text-muted-foreground'>
                              <Icons.blog className='size-4' />
                            </span>
                            {p.title}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </>
                )}
              </>
            )}

            {filteredSocials.length > 0 && (
              <>
                <CommandSeparator />
                <CommandLinkGroup
                  heading='Socials'
                  links={filteredSocials}
                  onSelect={go}
                />
              </>
            )}

            {filteredExtras.length > 0 && (
              <>
                <CommandSeparator />
                <CommandLinkGroup
                  heading='Links'
                  links={filteredExtras}
                  onSelect={go}
                />
              </>
            )}

            {filteredTheme && (
              <>
                <CommandSeparator />
                <CommandGroup heading='Theme'>
                  {THEME_ITEMS.map((item) => (
                    <CommandItem
                      key={item.value}
                      keywords={item.keywords}
                      onSelect={() => runTheme(item.theme)}
                      value={item.value}
                    >
                      <span className='text-muted-foreground'>{item.icon}</span>
                      {item.label}
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

            {!isEmpty && <SearchResults groups={tagGroups} onSelect={go} />}
          </CommandList>

          <CommandMenuFooter />
        </Command>
      </DialogContent>
    </Dialog>
  )
}
