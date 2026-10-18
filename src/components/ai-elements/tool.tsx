'use client'

import type { ToolUIPart } from 'ai'
import type { ComponentProps, ReactNode } from 'react'
import { Icons } from '@/components/icons/icons'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

// TODO(slopradar): unused-export: ToolState and the three exported *Props types in this file have no importers, un-export them (x4)
export type ToolState = ToolUIPart['state']

export type ToolProps = ComponentProps<typeof Collapsible>

export const Tool = ({ className, ...props }: ToolProps) => (
  <Collapsible
    className={cn(
      'not-prose w-full overflow-hidden rounded-md border border-dashed',
      className
    )}
    {...props}
  />
)

const defaultLabels: Record<ToolState, string> = {
  'approval-requested': 'awaiting approval',
  'approval-responded': 'responded',
  'input-available': 'running',
  'input-streaming': 'pending',
  'output-available': 'done',
  'output-denied': 'denied',
  'output-error': 'error',
}

// TODO(slopradar): token-rule: raw amber/green palette colors where globals.css defines text-safe status tokens, use text-success for output-available and add a warning token instead of amber-600/400
const statusTone: Record<ToolState, string> = {
  'approval-requested': 'text-amber-600 dark:text-amber-400',
  'approval-responded': 'text-primary',
  'input-available': 'text-primary',
  'input-streaming': 'text-muted-foreground',
  'output-available': 'text-green-600 dark:text-green-400',
  'output-denied': 'text-muted-foreground',
  'output-error': 'text-destructive',
}

export type ToolHeaderProps = ComponentProps<typeof CollapsibleTrigger> & {
  title: string
  state: ToolState
  icon?: ReactNode
  status?: string
}

export const ToolHeader = ({
  className,
  title,
  state,
  icon,
  status,
  ...props
}: ToolHeaderProps) => (
  <CollapsibleTrigger
    className={cn(
      'group/tool-trigger flex w-full items-center justify-between gap-3 px-3 py-2 text-left',
      className
    )}
    {...props}
  >
    <span className='flex min-w-0 items-center gap-2'>
      <span aria-hidden className='text-muted-foreground [&_svg]:size-3.5'>
        {icon ?? <Icons.wrench />}
      </span>
      <span className='truncate font-medium text-xs'>{title}</span>
    </span>
    <span className='flex shrink-0 items-center gap-2'>
      <span className={cn('text-[11px]', statusTone[state])}>
        {status ?? defaultLabels[state]}
      </span>
      <Icons.chevronDown
        aria-hidden
        className='size-3.5 text-muted-foreground transition-transform duration-200 group-data-panel-open/tool-trigger:rotate-180 motion-reduce:transition-none'
      />
    </span>
  </CollapsibleTrigger>
)

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>

export const ToolContent = ({ className, ...props }: ToolContentProps) => (
  <CollapsibleContent
    className={cn(
      'h-(--collapsible-panel-height) overflow-hidden border-t border-dashed transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none',
      className
    )}
    {...props}
  />
)
