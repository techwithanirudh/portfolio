'use client'

import { useSearchContext } from 'fumadocs-ui/contexts/search'
import type { ComponentProps } from 'react'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const SearchToggle = ({
  className,
  size = 'icon-sm',
}: Pick<ComponentProps<typeof Button>, 'className' | 'size'>) => {
  const { setOpenSearch, enabled } = useSearchContext()

  if (!enabled) {
    return null
  }

  return (
    <Button
      aria-label='Open search'
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
