'use client'

import { useSearchContext } from 'fumadocs-ui/contexts/search'
import type { ComponentProps } from 'react'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchToggleProps
  extends Pick<ComponentProps<typeof Button>, 'className' | 'size'> {
  hideIfDisabled?: boolean
}

export const SearchToggle = ({
  className,
  hideIfDisabled,
  size = 'icon-sm',
}: SearchToggleProps) => {
  const { setOpenSearch, enabled } = useSearchContext()

  if (hideIfDisabled && !enabled) {
    return null
  }

  return (
    <Button
      aria-label='Open search'
      // The 32px icon grows to a 40px hit area, still clear of its 6px gaps
      className={cn('relative after:absolute after:-inset-1', className)}
      data-search=''
      data-sound-press='off'
      onClick={() => setOpenSearch(true)}
      size={size}
      variant='ghost'
    >
      <Icons.search className='size-4.5' />
    </Button>
  )
}
