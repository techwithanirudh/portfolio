'use client'

// Command menu after chanhdai.com (MIT, (c) Chanh Dai)

import { useSound } from '@web-kits/audio/react'
import { useDocsSearch } from 'fumadocs-core/search/client'
import type { SharedProps } from 'fumadocs-ui/components/dialog/search'
import { useI18n } from 'fumadocs-ui/contexts/i18n'
import { useLenis } from 'lenis/react'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useRef } from 'react'
import { useSignInModal } from '@/components/features/auth/sign-in-modal'
import { CommandMenuFooter } from '@/components/features/search/footer'
import { SearchResults as SearchResultsList } from '@/components/features/search/results'
import {
  buildCommandGroups,
  buildPageEntryGroups,
  buildSearchTagGroups,
} from '@/components/features/search/utils/groups'
import { Icons } from '@/components/icons/icons'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { usePages } from '@/contexts/pages'
import { click, collapse, keyPress, notification } from '@/lib/audio/minimal'
import { signOut, useSession } from '@/lib/auth-client'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import type { CommandItem as SearchCommandItem } from '@/types/search'

const NAV_SOUND_THROTTLE_MS = 60

export default function SearchDialog({ open, onOpenChange }: SharedProps) {
  const { locale } = useI18n()
  const pathname = usePathname()
  const { openSignIn } = useSignInModal()
  const router = useRouter()
  const lenis = useLenis()
  const { setTheme } = useTheme()
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

  const { search, setSearch, query } = useDocsSearch({ locale, type: 'fetch' })
  const allPages = usePages()
  const { data: sessionData } = useSession()
  const user = sessionData?.user ?? null

  const accountItems = useMemo<SearchCommandItem[]>(
    () =>
      user
        ? [
            {
              action: 'account',
              icon: <Icons.user className='size-4' />,
              kind: 'account',
              title: 'Account',
            },
            {
              action: 'logout',
              icon: <Icons.logOut className='size-4' />,
              kind: 'account',
              title: 'Log Out',
            },
          ]
        : [
            {
              action: 'signin',
              icon: <Icons.logIn className='size-4' />,
              kind: 'account',
              title: 'Sign In',
            },
          ],
    [user]
  )

  const isEmpty = !search.trim()

  const allGroups = useMemo(
    () => buildCommandGroups(search, accountItems),
    [accountItems, search]
  )
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

  const scrollToHashTarget = (target: Element, immediate: boolean) => {
    if (lenis) {
      lenis.scrollTo(target as HTMLElement, { immediate })
    } else {
      target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
    }
  }

  const navigateToUrl = (url: string) => {
    const hashIndex = url.indexOf('#')
    const hash = hashIndex === -1 ? null : url.slice(hashIndex)
    const sameRouteTarget = hash ? document.querySelector(hash) : null

    router.push(url)

    if (!hash) {
      return
    }

    if (sameRouteTarget) {
      scrollToHashTarget(sameRouteTarget, prefersReducedMotion())
    }
  }

  const handleAccountAction = async (
    action: Extract<SearchCommandItem, { kind: 'account' }>['action']
  ) => {
    playConfirm()
    close()

    if (action === 'account') {
      navigateToUrl('/account')
      return
    }

    if (action === 'signin') {
      onOpenChange(false)
      openSignIn(pathname)
      return
    }

    await signOut()
    router.push('/')
    router.refresh()
  }

  const handleSelect = async (
    item: (typeof groups)[number]['items'][number]
  ) => {
    if (item.kind === 'account') {
      await handleAccountAction(item.action)
      return
    }

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

    navigateToUrl(item.url)
  }

  const go = (url: string) => {
    playConfirm()
    close()
    navigateToUrl(url)
  }

  const renderCommandItem = (item: CommandItemData) => (
    <CommandItem
      key={item.title}
      keywords={item.keywords}
      onSelect={() => handleSelect(item)}
      value={item.title}
    >
      {item.icon}
      <p className='line-clamp-1'>{item.title}</p>
    </CommandItem>
  )

  const renderCommandGroups = (list: typeof groups) =>
    list.map(({ group, items }) => (
      <CommandGroup heading={group} key={group}>
        {items.map(renderCommandItem)}
      </CommandGroup>
    ))

  return (
    <CommandDialog
      commandProps={{ onKeyDown: handleKeyDown, shouldFilter: false }}
      description='Search or jump to a page'
      onOpenChange={(next) => {
        if (!next) {
          setSearch('')
        }
        onOpenChange(next)
      }}
      open={open}
    >
      <CommandInput
        onValueChange={setSearch}
        placeholder='Type a command or search…'
        value={search}
      />

      <div className='bg-background ring-1 ring-border'>
        <CommandList className='scroll-fade min-h-80' data-lenis-prevent>
          {hasNoResults && <CommandEmpty>No results found.</CommandEmpty>}

          {renderCommandGroups(groups)}

          {!isEmpty && query.isLoading && (
            <div className='flex items-center justify-center py-8'>
              <Icons.spinner className='size-4 animate-spin text-muted-foreground' />
            </div>
          )}

          {isEmpty ? (
            <SearchResultsList groups={tagGroups} onSelect={go} />
          ) : null}

          {renderCommandGroups(afterGroups)}

          {isEmpty ? null : (
            <SearchResultsList groups={tagGroups} onSelect={go} />
          )}
        </CommandList>
      </div>

      <CommandMenuFooter />
    </CommandDialog>
  )
}
