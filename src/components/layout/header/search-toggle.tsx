'use client'

import { useSearchContext } from 'fumadocs-ui/contexts/search'
import type { ComponentProps } from 'react'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'

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
      className={className}
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
