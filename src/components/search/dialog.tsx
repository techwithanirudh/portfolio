'use client'
import { useSound } from '@web-kits/audio/react'
import { useDocsSearch } from 'fumadocs-core/search/client'
import type { SharedProps } from 'fumadocs-ui/components/dialog/search'
import { useI18n } from 'fumadocs-ui/contexts/i18n'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Fragment, useEffect, useMemo, useRef } from 'react'
import { Icons } from '@/components/icons/icons'
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
import { usePages } from '@/contexts/pages'
import { click, collapse, keyPress, notification } from '@/lib/audio/minimal'

const NAV_SOUND_THROTTLE_MS = 60

export default function SearchDialog({ open, onOpenChange }: SharedProps) {
  const { locale } = useI18n()
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const playOpen = useSound(notification)
  const playConfirm = useSound(click)
  const playCollapse = useSound(collapse)
  const playNavigate = useSound(keyPress)
  const lastNavSoundAtRef = useRef(0)

  useEffect(() => {
    if (!open) {
      return
    }

    playOpen()
  }, [open, playOpen])

  const { search, setSearch, query } = useDocsSearch({ type: 'fetch', locale })
  const allPages = usePages()

  const isEmpty = !search.trim()

  const allGroups = useMemo(() => buildCommandGroups(search), [search])
  const groups = isEmpty
    ? allGroups.filter((g) => g.position !== 'after')
    : allGroups
  const afterGroups = isEmpty
    ? allGroups.filter((g) => g.position === 'after')
    : []
  type CommandItemData = (typeof allGroups)[number]['items'][number]

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

  const playNavigationSound = () => {
    const now = performance.now()

    if (now - lastNavSoundAtRef.current < NAV_SOUND_THROTTLE_MS) {
      return
    }

    lastNavSoundAtRef.current = now
    playNavigate()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation()

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      playNavigationSound()
      return
    }

    if (event.key === 'Escape' && open) {
      playCollapse()
    }
  }

  const handleSelect = (item: (typeof groups)[number]['items'][number]) => {
    playConfirm()

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
    playConfirm()
    close()
    router.push(url)
  }

  const renderCommandItem = (item: CommandItemData) => (
    <CommandItem
      data-checked={
        item.kind === 'theme' && theme === item.theme ? true : undefined
      }
      key={item.title}
      keywords={item.keywords}
      onSelect={() => handleSelect(item)}
      value={item.title}
    >
      <span className='text-muted-foreground'>{item.icon}</span>
      {item.title}
    </CommandItem>
  )

  return (
    <Dialog
      onOpenChange={(next) => {
        if (!next) {
          setSearch('')
        }
        onOpenChange(next)
      }}
      open={open}
    >
      <DialogContent
        className='top-0 flex max-w-full translate-y-0 flex-col rounded-none! border-none bg-popover bg-clip-padding p-2 shadow-2xl sm:top-1/3 sm:max-w-lg sm:rounded-xl! sm:pb-11 sm:ring-4 sm:ring-neutral-200/80 dark:bg-neutral-900 dark:sm:ring-neutral-800'
        data-lenis-prevent
        showCloseButton={false}
      >
        <DialogHeader className='sr-only'>
          <DialogTitle>Command Palette</DialogTitle>
          <DialogDescription>Search or jump to a page</DialogDescription>
        </DialogHeader>
        <Command
          className='rounded-none bg-transparent **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:h-9! **:data-[slot=command-input]:h-9! **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border **:data-[slot=command-input-wrapper]:border-input **:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input]:py-0'
          onKeyDown={handleKeyDown}
          shouldFilter={false}
        >
          <CommandInput
            onValueChange={setSearch}
            placeholder='Type a command or search...'
            value={search}
          />

          <CommandList
            className='supports-timeline-scroll:scroll-fade-effect-y no-scrollbar max-h-[60dvh] min-h-80 scroll-pt-2 scroll-pb-1.5 [--mask-height:32px] [--scroll-buffer:1rem] sm:max-h-80'
            data-lenis-prevent
          >
            {groups.map(({ group, items }, i) => (
              <Fragment key={group}>
                {i > 0 && <CommandSeparator />}
                <CommandGroup heading={group}>
                  {items.map(renderCommandItem)}
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

            {isEmpty ? (
              <SearchResultsList groups={tagGroups} onSelect={go} />
            ) : null}

            {afterGroups.map(({ group, items }) => (
              <Fragment key={group}>
                <CommandSeparator />
                <CommandGroup heading={group}>
                  {items.map(renderCommandItem)}
                </CommandGroup>
              </Fragment>
            ))}

            {isEmpty ? null : (
              <SearchResultsList groups={tagGroups} onSelect={go} />
            )}
          </CommandList>

          <CommandMenuFooter />
        </Command>
      </DialogContent>
    </Dialog>
  )
}
