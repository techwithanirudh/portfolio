'use client'

import { useDocsSearch } from 'fumadocs-core/search/client'
import {
  SearchDialog,
  SearchDialogList,
  SearchDialogListItem,
} from 'fumadocs-ui/components/dialog/search'
import { useI18n } from 'fumadocs-ui/contexts/i18n'
import { parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { ViewAnimation } from '@/components/view-animation'
import { tags } from '@/constants/config'
import { cn } from '@/lib/utils'

const ItemBadge = ({ label }: { label: string }) => (
  <span className='pointer-events-none absolute inset-y-0 right-4 flex items-center'>
    <span className='border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase tracking-wide'>
      {label}
    </span>
  </span>
)

const getItemTag = (url: string) => {
  if (url.startsWith('/work')) {
    return 'work'
  }
  if (url.startsWith('/blog')) {
    return 'blog'
  }
  return 'page'
}

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

  useEffect(() => {
    if (queryParam) {
      setSearch(queryParam)
    }
  }, [queryParam, setSearch])

  const hasQuery = search.trim().length > 0

  return (
    <SearchDialog
      isLoading={query.isLoading}
      onOpenChange={() => null}
      onSearchChange={handleSearchChange}
      open
      search={search}
    >
      <Section className='flex flex-1 flex-col' sectionClassName='h-full'>
        <div className='flex flex-col'>
          <ViewAnimation
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <InputGroup className='!bg-background h-12 rounded-none border-0 border-line border-b shadow-none'>
              <InputGroupAddon className='border-0 pl-4 text-muted-foreground'>
                <Icons.search className='icon-turn size-4' />
              </InputGroupAddon>
              <InputGroupInput
                className='text-sm'
                onChange={(event) => {
                  handleSearchChange(event.target.value)
                }}
                placeholder='Search posts and work...'
                value={search}
              />
              {search.length > 0 && (
                <InputGroupAddon
                  align='inline-end'
                  className='pr-4 font-mono text-xs tabular-nums'
                >
                  {resultCount} results
                </InputGroupAddon>
              )}
            </InputGroup>
          </ViewAnimation>
          <ViewAnimation
            delay={0.05}
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <div className='flex w-full divide-x divide-line border-line border-b'>
              {tags.map((scopeOption) => {
                const value = scopeOption.value ?? 'all'
                const isActive = scopeParam === value
                return (
                  <button
                    aria-pressed={isActive}
                    className={cn(
                      'inline-flex h-10 flex-1 items-center justify-center font-mono text-xs lowercase transition-colors',
                      isActive
                        ? 'bg-card text-card-foreground'
                        : 'bg-transparent text-muted-foreground hover:bg-card/80 hover:text-card-foreground'
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
        {!hasQuery && (
          <ViewAnimation
            delay={0.1}
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <div className='py-16 text-center font-mono text-muted-foreground text-xs'>
              {'// start typing to search posts and work'}
            </div>
          </ViewAnimation>
        )}
        <SearchDialogList
          className='[&>div]:!max-h-none [&>div]:!overflow-visible [&>div]:!p-0'
          Item={({ item, onClick }) => (
            <div className='relative'>
              <SearchDialogListItem
                className='rounded-none border-line border-b px-4 py-3'
                item={item}
                onClick={onClick}
              />
              {item.type === 'page' ? (
                <ItemBadge label={getItemTag(item.url)} />
              ) : null}
            </div>
          )}
          items={query.data === 'empty' ? null : query.data}
        />
      </Section>
    </SearchDialog>
  )
}
