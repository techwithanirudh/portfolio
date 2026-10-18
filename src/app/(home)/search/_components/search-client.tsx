'use client'

import { useDocsSearch } from 'fumadocs-core/search/client'
import {
  SearchDialog,
  SearchDialogList,
  SearchDialogListItem,
  type SearchItemType,
} from 'fumadocs-ui/components/dialog/search'
import { useI18n } from 'fumadocs-ui/contexts/i18n'
import { parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs'
import { type ComponentProps, type ReactNode, useEffect } from 'react'
import { PostEmpty } from '@/components/features/blog/post-empty'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { ViewAnimation } from '@/components/view-animation'
import { tags } from '@/constants/config'
import { pages } from '@/constants/pages'
import { cn } from '@/lib/utils'

const ItemBadge = ({ label }: { label: string }) => (
  <span className='pointer-events-none absolute inset-y-0 right-5 flex items-center'>
    <span className='rounded-full border border-border px-2 py-0.5 text-muted-foreground text-xs uppercase tracking-wide'>
      {label}
    </span>
  </span>
)

const getItemTag = (url: string) => {
  if (url.startsWith('/projects')) {
    return 'projects'
  }
  if (url.startsWith('/blog')) {
    return 'blog'
  }
  return 'page'
}

const excerptWidths = [['w-3/5'], ['w-4/5', 'w-2/5'], ['w-1/2']]
const bar = 'bg-foreground/10'

const ResultsSkeleton = () => (
  <div aria-busy className='flex w-full flex-col p-1' role='status'>
    <span className='sr-only'>Searching</span>
    {excerptWidths.map((lines) => (
      <div key={lines.join()}>
        <div className='flex items-center justify-between gap-4 border-border border-b border-dashed p-3'>
          <Skeleton className={cn('h-4 w-1/3', bar)} />
          <Skeleton className={cn('mr-2 h-5 w-14 rounded-full', bar)} />
        </div>
        {lines.map((width) => (
          <div className='relative p-3 ps-7' key={width}>
            <div className='absolute inset-y-0 start-3 w-px bg-border' />
            <Skeleton className={cn('h-3.5', width, bar)} />
          </div>
        ))}
      </div>
    ))}
  </div>
)

const CenteredEmpty = ({ children }: { children: ReactNode }) => (
  <div className='flex min-h-[calc(100cqh-0.5rem)] flex-col justify-center'>
    {children}
  </div>
)

const emptyLinkByScope = {
  all: null,
  blog: undefined,
  projects: { href: pages.projects.path, label: 'See every project' },
} satisfies Record<string, ComponentProps<typeof PostEmpty>['link']>

const SearchResultItem = ({
  item,
  onClick,
}: {
  item: SearchItemType
  onClick: () => void
}) => (
  <div className='relative'>
    <SearchDialogListItem
      className='rounded-none border-border border-b border-dashed p-3 last:border-b-0'
      item={item}
      onClick={onClick}
    />
    {item.type === 'page' ? <ItemBadge label={getItemTag(item.url)} /> : null}
  </div>
)

const tagValues = tags
  .map((tag) => tag.value)
  .filter((value): value is Exclude<typeof value, undefined> => Boolean(value))

const scopeParser = parseAsStringLiteral(['all', ...tagValues])

export function SearchClient() {
  const { locale } = useI18n()
  const [queryParam, setQueryParam] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )
  const [scopeParam, setScopeParam] = useQueryState(
    'tag',
    scopeParser.withDefault('all')
  )

  const tag = scopeParam === 'all' ? undefined : scopeParam

  const { search, setSearch, query } = useDocsSearch({
    locale,
    tag,
    type: 'fetch',
  })

  const resultCount =
    query.data !== 'empty' && query.data ? query.data.length : 0
  const handleSearchChange = (value: string) => {
    setSearch(value)
    setQueryParam(value.length > 0 ? value : null)
  }

  // TODO(slopradar): effect-mirrors-state: copies the q param into the fumadocs search state after mount, so the query lives in two places, drive one from the other without an effect (rerender-derived-state-no-effect)
  useEffect(() => {
    if (queryParam) {
      setSearch(queryParam)
    }
  }, [queryParam, setSearch])

  const hasQuery = search.trim().length > 0
  const pending = hasQuery && query.data === 'empty'

  return (
    <SearchDialog
      isLoading={query.isLoading}
      onOpenChange={() => null}
      onSearchChange={handleSearchChange}
      open
      search={search}
    >
      <Section fill='contain'>
        <div className='flex flex-col'>
          <ViewAnimation>
            <InputGroup className='!bg-background h-10 rounded-none border-0 shadow-none ring-inset has-[[data-slot=input-group-control]:focus-visible]:ring-1 has-[[data-slot=input-group-control]:focus-visible]:ring-primary/60'>
              <InputGroupAddon className='border-0 pl-3 text-muted-foreground'>
                <Icons.search className='icon-turn size-4' />
              </InputGroupAddon>
              <InputGroupInput
                className='text-sm'
                onChange={(event) => {
                  handleSearchChange(event.target.value)
                }}
                placeholder='Search posts and projects…'
                value={search}
              />
              {search.length > 0 && !pending && (
                <InputGroupAddon
                  align='inline-end'
                  className='pr-3 tabular-nums'
                >
                  {resultCount} {resultCount === 1 ? 'result' : 'results'}
                </InputGroupAddon>
              )}
            </InputGroup>
          </ViewAnimation>
          <ViewAnimation delay={0.05}>
            <div className='flex w-full flex-wrap justify-between divide-x divide-dashed divide-border border-border border-y border-dashed'>
              {tags.map((scopeOption) => {
                const value = scopeOption.value ?? 'all'
                const isActive = scopeParam === value
                return (
                  <button
                    aria-pressed={isActive}
                    className={cn(
                      'inline-flex flex-1 items-center gap-2 p-2 px-3 text-sm transition-colors',
                      isActive
                        ? 'bg-card text-card-foreground'
                        : 'bg-transparent text-muted-foreground hover:text-card-foreground'
                    )}
                    key={value}
                    onClick={() => {
                      setScopeParam(value)
                    }}
                    type='button'
                  >
                    {scopeOption.name}
                  </button>
                )
              })}
            </div>
          </ViewAnimation>
        </div>
        <div className='min-h-0 flex-1'>
          <ScrollArea
            className='h-full w-full [&>[data-slot=scroll-area-scrollbar]]:py-1.5 [&>[data-slot=scroll-area-scrollbar]]:pr-1 [&>[data-slot=scroll-area-viewport]]:[container-type:size] [&>[data-slot=scroll-area-viewport]]:[mask-image:linear-gradient(to_bottom,transparent,#000_min(2.5rem,var(--scroll-area-overflow-y-start,0px)))]'
            data-lenis-prevent
          >
            {!hasQuery && (
              <ViewAnimation delay={0.1}>
                <p className='py-12 text-center text-muted-foreground text-sm'>
                  Start typing to search.
                </p>
              </ViewAnimation>
            )}
            {pending && <ResultsSkeleton />}
            <SearchDialogList
              // Let the scroll area own the height instead of fumadocs' 460px cap
              className='!h-auto [&>div]:!p-0 [&>div]:!pt-2 [&_#fd-search-list]:max-h-none [&_#fd-search-list]:overflow-visible'
              Empty={() => (
                <CenteredEmpty>
                  <PostEmpty link={emptyLinkByScope[scopeParam]} />
                </CenteredEmpty>
              )}
              Item={SearchResultItem}
              items={query.data === 'empty' ? null : query.data}
            />
          </ScrollArea>
        </div>
      </Section>
    </SearchDialog>
  )
}
