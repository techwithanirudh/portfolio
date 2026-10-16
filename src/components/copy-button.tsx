'use client'

import type { IconInput } from 'morphicons/react'
import { MorphIcon, morphIcons } from '@/components/icons/morph-icon'
import type { CopyState } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'

interface CopyStateIconProps {
  className?: string
  doneIcon?: IconInput
  errorIcon?: IconInput
  idleIcon?: IconInput
  state: CopyState
}

export function CopyStateIcon({
  className,
  state,
  idleIcon = morphIcons.copy,
  doneIcon = morphIcons.check,
  errorIcon = morphIcons.error,
}: CopyStateIconProps) {
  const iconByState = { done: doneIcon, error: errorIcon, idle: idleIcon }

  return (
    <MorphIcon
      className={cn(
        'transition-colors duration-300',
        className,
        state === 'done' && 'text-primary',
        state === 'error' && 'text-destructive'
      )}
      data-slot={`${state}-icon`}
      icon={iconByState[state]}
    />
  )
}
