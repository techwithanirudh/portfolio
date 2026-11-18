'use client'

import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type SuggestionsProps = ComponentProps<'div'>

export const Suggestions = ({ className, ...props }: SuggestionsProps) => (
  <div
    className={cn('flex flex-wrap justify-center gap-1.5', className)}
    {...props}
  />
)

type SuggestionProps = Omit<ComponentProps<'button'>, 'onClick'> & {
  suggestion: string
  onClick: (suggestion: string) => void
}

export const Suggestion = ({
  className,
  suggestion,
  onClick,
  children,
  ...props
}: SuggestionProps) => (
  <button
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border border-border border-dashed bg-card px-2.5 py-1 text-foreground text-xs outline-none transition-[background-color,scale] duration-150 ease-out-strong hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-muted-foreground',
      className
    )}
    onClick={() => onClick(suggestion)}
    type='button'
    {...props}
  >
    {children ?? suggestion}
  </button>
)
