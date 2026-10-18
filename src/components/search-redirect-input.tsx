'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Icons } from '@/components/icons/icons'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { pages } from '@/constants/pages'
import { cn } from '@/lib/utils'

interface SearchRedirectInputProps {
  className?: string
  placeholder?: string
  tag: string
}

export function SearchRedirectInput({
  tag,
  placeholder = 'Search...',
  className,
}: SearchRedirectInputProps) {
  const router = useRouter()
  const [value, setValue] = useState('')
  const hasValue = value.trim().length > 0

  const handleSubmit = useCallback(
    (nextValue: string) => {
      const trimmedValue = nextValue.trim()
      if (!trimmedValue) {
        return
      }

      const params = new URLSearchParams({ q: trimmedValue, tag })
      router.push(`${pages.search.path}?${params.toString()}`)
    },
    [router, tag]
  )

  return (
    <InputGroup className={cn('bg-background', className)}>
      <InputGroupAddon className='text-muted-foreground'>
        <Icons.search className='icon-turn size-4' />
      </InputGroupAddon>
      <InputGroupInput
        aria-label={placeholder}
        className='text-sm [&::-webkit-search-cancel-button]:hidden'
        onChange={(event) => setValue(event.target.value)}
        // TODO(slopradar): hand-written-form: Enter handling plus router.push rebuilds a GET form, render Form from 'next/form' with action='/search' and a hidden tag input so it works without JS, and drop handleSubmit/useCallback
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            handleSubmit(event.currentTarget.value)
          }
          if (event.key === 'Escape') {
            setValue('')
          }
        }}
        placeholder={placeholder}
        type='search'
        value={value}
      />
      <InputGroupAddon
        align='inline-end'
        className={cn(
          'transition-[scale,opacity] duration-150 ease-out-strong has-[>button]:mr-0',
          hasValue
            ? 'scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0'
        )}
      >
        <InputGroupButton
          aria-label='Submit search'
          disabled={!hasValue}
          onClick={() => handleSubmit(value)}
          size='icon-xs'
          variant='default'
        >
          <Icons.arrowRight className='icon-arrow-button size-3.5' />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
