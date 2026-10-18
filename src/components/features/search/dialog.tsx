'use client'
import { useSound } from '@web-kits/audio/react'
import { useDocsSearch } from 'fumadocs-core/search/client'
import type { SharedProps } from 'fumadocs-ui/components/dialog/search'
import { useI18n } from 'fumadocs-ui/contexts/i18n'
import { useLenis } from 'lenis/react'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Fragment, useEffect, useMemo, useRef } from 'react'
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
  CommandSeparator,
} from '@/components/ui/command'
import { usePages } from '@/contexts/pages'
import { click, collapse, keyPress, notification } from '@/lib/audio/minimal'
import { toggleSound } from '@/lib/audio/preferences'
import { signOut, useSession } from '@/lib/auth-client'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { scrollToTarget } from '@/lib/scroll-to-target'
import type { CommandItem as SearchCommandItem } from '@/types/search'

const NAV_SOUND_THROTTLE_MS = 60

function useSearchSounds(open: boolean) {
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

  const playNavigationSound = () => {
    const now = performance.now()

    if (now - lastNavSoundAtRef.current < NAV_SOUND_THROTTLE_MS) {
      return
    }

    lastNavSoundAtRef.current = now
    playNavigate()
  }

  return { playCollapse, playConfirm, playNavigationSound }
}

// TODO(slopradar): long-function: account items, group building and navigation still live in this one component, extract a useCommandActions hook
export default function SearchDialog({
  open,
  onOpenChange,
  onMount,
}: SharedProps & { onMount?: () => void }) {
  const { locale } = useI18n()
  const pathname = usePathname()
  const { openSignIn } = useSignInModal()
  const router = useRouter()
  const lenis = useLenis()
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    onMount?.()
  }, [onMount])

  const { playCollapse, playConfirm, playNavigationSound } =
    useSearchSounds(open)

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
              title: 'Log out',
            },
          ]
        : [
            {
              action: 'signin',
              icon: <Icons.logIn className='size-4' />,
              kind: 'account',
              title: 'Sign in',
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Keep typing away from page shortcuts, but let Escape through: Base UI
    // dismisses on a bubbling document listener (Radix listened in capture)
    if (event.key !== 'Escape') {
      event.stopPropagation()
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      playNavigationSound()
      return
    }

    if (event.key === 'Escape' && open) {
      playCollapse()
    }
  }

  const navigateToUrl = (url: string) => {
    const hashIndex = url.indexOf('#')
    const hash = hashIndex === -1 ? null : url.slice(hashIndex)
    const sameRouteTarget = hash
      ? document.querySelector<HTMLElement>(hash)
      : null

    router.push(url)

    if (!hash) {
      return
    }

    if (sameRouteTarget) {
      scrollToTarget(lenis, sameRouteTarget, {
        immediate: prefersReducedMotion(),
      })
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
      openSignIn(pathname)
      return
    }

    await signOut()
    router.push('/')
    router.refresh()
  }

  const handleSelect = async (item: SearchCommandItem) => {
    if (item.kind === 'account') {
      await handleAccountAction(item.action)
      return
    }

    if (item.kind === 'sound') {
      close()
      toggleSound()
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

  const renderCommandItem = (item: SearchCommandItem) => (
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

  const renderGroup = (
    { group, items }: (typeof allGroups)[number],
    { separated }: { separated: boolean }
  ) => (
    <Fragment key={group}>
      {separated && <CommandSeparator />}
      <CommandGroup heading={group}>
        {items.map(renderCommandItem)}
      </CommandGroup>
    </Fragment>
  )

  return (
    <CommandDialog
      commandProps={{
        label: 'Search the site',
        onKeyDown: handleKeyDown,
        shouldFilter: false,
      }}
      description='Search or jump to a page'
      onOpenChange={(next) => {
        if (!next) {
          setSearch('')
        }
        onOpenChange(next)
      }}
      open={open}
      title='Command palette'
    >
      <CommandInput
        data-sound-press='off'
        enterKeyHint='search'
        onValueChange={setSearch}
        placeholder='Type a command or search…'
        value={search}
      />

      <div className='rounded-xl bg-background ring-1 ring-border'>
        <CommandList
          className='supports-timeline-scroll:scroll-fade-effect-y no-scrollbar max-h-[60dvh] min-h-[min(20rem,50dvh)] [--mask-height:32px] [--scroll-buffer:1rem] sm:max-h-[min(20rem,60dvh)]'
          data-lenis-prevent
        >
          {groups.map((group, i) => renderGroup(group, { separated: i > 0 }))}

          {!isEmpty && query.isLoading && (
            <div className='flex items-center justify-center py-6'>
              <Icons.spinner className='size-4 animate-spin text-muted-foreground' />
            </div>
          )}

          {hasNoResults && (
            <CommandEmpty>No results for &ldquo;{search}&rdquo;</CommandEmpty>
          )}

          <SearchResultsList groups={tagGroups} onSelect={go} />

          {afterGroups.map((group) => renderGroup(group, { separated: true }))}
        </CommandList>
      </div>

      <CommandMenuFooter />
    </CommandDialog>
  )
}
