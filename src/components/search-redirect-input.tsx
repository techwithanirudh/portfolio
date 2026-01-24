'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { cn } from '@/lib/utils'

interface SearchRedirectInputProps {
  tag: string
  placeholder?: string
  className?: string
}

export function SearchRedirectInput({
  tag,
  placeholder = 'Search...',
  className,
}: SearchRedirectInputProps) {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [debouncedValue] = useDebounceValue(value, 500)

  useEffect(() => {
    if (!debouncedValue.trim()) {
      return
    }

    const params = new URLSearchParams({ tag, q: debouncedValue.trim() })
    router.push(`/search?${params.toString()}`)
  }, [debouncedValue, router, tag])

  return (
    <InputGroup className={cn('h-9 max-w-xs rounded-none border-0 !bg-background shadow-none border-b border-dashed border-border', className)}>
      <InputGroupAddon className='border-0 text-muted-foreground'>
        <Search className='size-4' />
      </InputGroupAddon>
      <InputGroupInput
        className='text-sm'
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </InputGroup>
  )
}
