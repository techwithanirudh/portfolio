'use client'
import { useDocsSearch } from 'fumadocs-core/search/client'
import type { SharedProps } from 'fumadocs-ui/components/dialog/search'
import { useI18n } from 'fumadocs-ui/contexts/i18n'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Fragment, useMemo } from 'react'
import { Icons } from '@/components/icons/icons'
import { usePages } from '@/contexts/pages'
import { CommandMenuFooter } from '@/components/search/footer'
import { SearchResults as SearchResultsList } from '@/components/search/results'
import {
  buildCommandGroups,
  buildPageEntryGroups,
  buildSearchTagGroups,
} from '@/components/search/utils/groups'
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

export default function SearchDialog({ open, onOpenChange }: SharedProps) {
  const { locale } = useI18n()
  const router = useRouter()
  const { setTheme, theme } = useTheme()

  const { search, setSearch, query } = useDocsSearch({ type: 'fetch', locale })
  const allPages = usePages()

  const isEmpty = !search.trim()

  const groups = useMemo(() => buildCommandGroups(search), [search])

  const tagGroups = useMemo(() => {
    if (isEmpty) {
      return buildPageEntryGroups(allPages)
    }
    if (!query.data || query.data === 'empty') {
      return []
    }
    return buildSearchTagGroups(query.data)
  }, [allPages, isEmpty, query.data])

  const hasNoResults =
    !(isEmpty || query.isLoading) &&
    tagGroups.length === 0 &&
    groups.length === 0

  const close = () => {
    onOpenChange(false)
    setSearch('')
  }

  const handleSelect = (item: (typeof groups)[number]['items'][number]) => {
    if (item.kind === 'theme') {
      setTheme(item.theme)
      close()
      return
    }

    close()

    if (item.kind === 'link') {
      window.open(item.url, '_blank', 'noopener,noreferrer')
      return
    }

    router.push(item.url)
  }

  const go = (url: string) => {
    close()
    router.push(url)
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
            className='supports-timeline-scroll:scroll-fade-effect-y max-h-[60dvh] sm:max-h-80'
            data-lenis-prevent
          >
            {groups.map(({ group, items }, i) => (
              <Fragment key={group}>
                {i > 0 && <CommandSeparator />}
                <CommandGroup heading={group}>
                  {items.map((item) => (
                    <CommandItem
                      data-checked={
                        item.kind === 'theme' && theme === item.theme
                          ? true
                          : undefined
                      }
                      key={item.title}
                      keywords={item.keywords}
                      onSelect={() => handleSelect(item)}
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

            <SearchResultsList groups={tagGroups} onSelect={go} />
          </CommandList>

          <CommandMenuFooter />
        </Command>
      </DialogContent>
    </Dialog>
  )
}
