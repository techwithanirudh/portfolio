'use client'

import { Fragment } from 'react'
import { Icons } from '@/components/icons/icons'
import { SearchResults } from '@/components/search/results'
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import type {
  CommandGroup as CommandGroupData,
  CommandItem as CommandItemData,
} from '@/types/search'
import type { SearchTagGroup } from '@/types/search/results'

export function CommandGroupSections({
  groups,
  onSelect,
  selectedTheme,
  showLeadingSeparator = false,
}: {
  groups: CommandGroupData[]
  onSelect: (item: CommandItemData) => void
  selectedTheme?: string
  showLeadingSeparator?: boolean
}) {
  if (groups.length === 0) {
    return null
  }

  return (
    <>
      {groups.map(({ group, items }, index) => (
        <Fragment key={group}>
          {(showLeadingSeparator || index > 0) && <CommandSeparator />}
          <CommandGroup heading={group}>
            {items.map((item) => (
              <CommandItem
                data-checked={
                  item.kind === 'theme' && selectedTheme === item.theme
                    ? true
                    : undefined
                }
                key={item.title}
                keywords={item.keywords}
                onSelect={() => onSelect(item)}
                value={item.title}
              >
                <span className='text-muted-foreground'>{item.icon}</span>
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </Fragment>
      ))}
    </>
  )
}

export function CommandContentResults({
  groups,
  onSelect,
  showSeparator,
}: {
  groups: SearchTagGroup[]
  onSelect: (url: string) => void
  showSeparator: boolean
}) {
  if (groups.length === 0) {
    return null
  }

  return (
    <>
      {showSeparator && <CommandSeparator />}
      <SearchResults groups={groups} onSelect={onSelect} />
    </>
  )
}

export function CommandSearchLoading({
  showSeparator,
}: {
  showSeparator: boolean
}) {
  return (
    <>
      {showSeparator && <CommandSeparator />}
      <div className='flex items-center justify-center py-6'>
        <Icons.spinner className='size-4 animate-spin text-muted-foreground' />
      </div>
    </>
  )
}
