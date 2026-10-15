'use client'

import {
  type ButtonProps,
  buttonVariants,
} from 'fumadocs-ui/components/ui/button'
import { useSearchContext } from 'fumadocs-ui/contexts/search'
import type { ComponentProps } from 'react'
import { Icons } from '@/components/icons/icons'
import { cn } from '@/lib/utils'

interface SearchToggleProps
  extends Omit<ComponentProps<'button'>, 'color'>,
    ButtonProps {
  hideIfDisabled?: boolean
}

export const SearchToggle = ({
  hideIfDisabled,
  size = 'icon-sm',
  color = 'ghost',
  ...props
}: SearchToggleProps) => {
  const { setOpenSearch, enabled } = useSearchContext()

  if (hideIfDisabled && !enabled) {
    return null
  }

  return (
    <button
      aria-label='Open Search'
      className={cn(
        buttonVariants({
          color,
          size,
        }),
        props.className
      )}
      data-search=''
      data-sound-press='off'
      onClick={() => setOpenSearch(true)}
      type='button'
    >
      <Icons.search />
    </button>
  )
}
