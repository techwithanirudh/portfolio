'use client'

import { m } from 'motion/react'
import type { ReactNode } from 'react'
import { IconSwap, IconSwapItem } from '@/components/icon-swap'
import { Icons } from '@/components/icons/icons'
import type { CopyState } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'

interface CopyStateIconProps {
  className?: string
  doneIcon?: ReactNode
  errorIcon?: ReactNode
  idleIcon?: ReactNode
  state: CopyState
}

// Blur swap from chanhdai's Copy Button (MIT):
// https://chanhdai.com/components/copy-button
export function CopyStateIcon({
  className,
  state,
  idleIcon = <Icons.copy />,
  doneIcon = <Icons.check />,
  errorIcon = <Icons.error />,
}: CopyStateIconProps) {
  const iconByState = { done: doneIcon, error: errorIcon, idle: idleIcon }

  return (
    <IconSwap>
      <IconSwapItem
        as={m.span}
        className={cn(
          'inline-flex transition-colors duration-300 [&_svg]:size-4',
          className,
          state === 'done' && 'text-primary',
          state === 'error' && 'text-destructive'
        )}
        data-slot={`${state}-icon`}
        key={state}
      >
        {iconByState[state]}
      </IconSwapItem>
    </IconSwap>
  )
}
