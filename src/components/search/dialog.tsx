'use client'
import { useSound } from '@web-kits/audio/react'
import { useDocsSearch } from 'fumadocs-core/search/client'
import type { SharedProps } from 'fumadocs-ui/components/dialog/search'
import { useI18n } from 'fumadocs-ui/contexts/i18n'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useRef } from 'react'
import { Icons } from '@/components/icons/icons'
import { CommandMenuFooter } from '@/components/search/footer'
import {
  CommandContentResults,
  CommandGroupSections,
  CommandSearchLoading,
} from '@/components/search/skeleton'
import {
  buildCommandGroups,
  buildPageEntryGroups,
  buildSearchTagGroups,
} from '@/components/search/utils/groups'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { usePages } from '@/contexts/pages'
import { click, collapse, keyPress, notification } from '@/lib/audio/minimal'
import type { CommandGroup, CommandItem } from '@/types/search'

const NAV_SOUND_THROTTLE_MS = 60

export default function SearchDialog({ open, onOpenChange }: SharedProps) {
  const { locale } = useI18n()
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const sounds = {
    collapse: useSound(collapse),
    confirm: useSound(click),
    navigate: useSound(keyPress),
    open: useSound(notification),
  }
  const lastNavSoundAtRef = useRef(0)
  const pages = usePages()
  const { search, setSearch, query } = useDocsSearch({ type: 'fetch', locale })
  const isEmpty = !search.trim()

  const [primaryGroups, secondaryGroups] = useMemo(() => {
    const groups = buildCommandGroups(search)

    if (!isEmpty) {
      return [groups, [] as CommandGroup[]] as const
    }

    return [
      groups.filter((group) => group.position !== 'after'),
      groups.filter((group) => group.position === 'after'),
    ] as const
  }, [isEmpty, search])

  const contentGroups = useMemo(() => {
    if (isEmpty) {
      return buildPageEntryGroups(pages)
    }

    if (!query.data || query.data === 'empty') {
      return []
    }

    return buildSearchTagGroups(query.data, pages)
  }, [isEmpty, pages, query.data])

  const hasNoResults =
    !(isEmpty || query.isLoading) &&
    contentGroups.length === 0 &&
    primaryGroups.length === 0

  useEffect(() => {
    if (open) {
      sounds.open()
    }
  }, [open, sounds.open])

  const close = () => {
    onOpenChange(false)
    setSearch('')
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSearch('')
    }

    onOpenChange(next)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation()

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const now = performance.now()

      if (now - lastNavSoundAtRef.current >= NAV_SOUND_THROTTLE_MS) {
        lastNavSoundAtRef.current = now
        sounds.navigate()
      }

      return
    }

    if (event.key === 'Escape' && open) {
      sounds.collapse()
    }
  }

  const selectCommand = (item: CommandItem) => {
    sounds.confirm()

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

  const selectContent = (url: string) => {
    sounds.confirm()
    close()
    router.push(url)
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
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
            <CommandGroupSections
              groups={primaryGroups}
              onSelect={selectCommand}
              selectedTheme={theme}
            />

            {!isEmpty && query.isLoading && (
              <CommandSearchLoading showSeparator={primaryGroups.length > 0} />
            )}

            {hasNoResults && (
              <CommandEmpty className='py-0'>
                <Empty className='min-h-80'>
                  <EmptyHeader>
                    <EmptyMedia>
                      <Icons.search />
                    </EmptyMedia>
                    <EmptyTitle>
                      No results for &ldquo;{search}&rdquo;.
                    </EmptyTitle>
                  </EmptyHeader>
                </Empty>
              </CommandEmpty>
            )}

            <CommandContentResults
              groups={contentGroups}
              onSelect={selectContent}
              showSeparator={primaryGroups.length > 0}
            />

            <CommandGroupSections
              groups={secondaryGroups}
              onSelect={selectCommand}
              selectedTheme={theme}
              showLeadingSeparator={
                primaryGroups.length > 0 || contentGroups.length > 0
              }
            />
          </CommandList>

          <CommandMenuFooter />
        </Command>
      </DialogContent>
    </Dialog>
  )
}
