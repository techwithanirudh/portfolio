'use client'

import { CommandGroup, CommandItem } from '@/components/ui/command'
import type { CommandLinkItem } from '@/constants/search'

interface CommandLinkGroupProps {
  fallbackIcon?: React.ReactNode
  heading: string
  links: CommandLinkItem[]
  onSelect: (url: string, openInNewTab?: boolean) => void
}

export function CommandLinkGroup({
  heading,
  links,
  fallbackIcon,
  onSelect,
}: CommandLinkGroupProps) {
  if (links.length === 0) {
    return null
  }

  return (
    <CommandGroup heading={heading}>
      {links.map((link) => (
        <CommandItem
          key={link.url}
          keywords={link.keywords}
          onSelect={() => onSelect(link.url, link.openInNewTab)}
          value={link.title}
        >
          <span className='text-muted-foreground'>
            {link.icon ?? fallbackIcon}
          </span>
          <span className='truncate'>{link.title}</span>
        </CommandItem>
      ))}
    </CommandGroup>
  )
}
