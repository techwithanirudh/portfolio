'use client'

import { CheckIcon, CopyIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/** Copies a value and confirms in place for two seconds. */
export function CopyButton({
  className,
  label,
  value,
}: {
  className?: string
  label: string
  value: string
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) {
      return
    }
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <button
      aria-label={copied ? 'Copied' : label}
      className={cn(
        'ds-label inline-flex h-6 items-center gap-1 rounded-[3px] border border-(--line) bg-(--paper) px-1.5 text-(--ink-muted) transition-colors hover:border-(--line-strong) hover:text-(--ink)',
        className
      )}
      onClick={() => {
        navigator.clipboard
          .writeText(value)
          .then(() => setCopied(true))
          .catch(() => undefined)
      }}
      type='button'
    >
      {copied ? (
        <CheckIcon aria-hidden className='size-3 text-(--accent)' />
      ) : (
        <CopyIcon aria-hidden className='size-3' />
      )}
      <span aria-live='polite'>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}
