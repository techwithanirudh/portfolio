'use client'

import type { ComponentProps } from 'react'
import { Icons } from '@/components/icons/icons'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

export type SourcesProps = ComponentProps<typeof Collapsible>

export const Sources = ({ className, ...props }: SourcesProps) => (
  <Collapsible
    className={cn('group/sources not-prose text-sm', className)}
    {...props}
  />
)

export type SourcesTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  count: number
}

// The search glyph turns into a chevron on hover and while open, so the row
// reads as a disclosure without an extra icon
export const SourcesTrigger = ({
  className,
  count,
  children,
  ...props
}: SourcesTriggerProps) => (
  <CollapsibleTrigger
    className={cn(
      'group/trigger flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground data-panel-open:text-foreground',
      className
    )}
    {...props}
  >
    {children ?? (
      <>
        <span aria-hidden className='relative size-4'>
          <Icons.search className='absolute inset-0 size-4 transition-opacity duration-200 group-hover/trigger:opacity-0 group-data-panel-open/trigger:opacity-0' />
          <Icons.chevronDown className='absolute inset-0 size-4 opacity-0 transition-[opacity,rotate] duration-200 group-hover/trigger:opacity-100 group-data-panel-open/trigger:rotate-180 group-data-panel-open/trigger:opacity-100' />
        </span>
        <span className='font-medium'>
          Used {count} {count === 1 ? 'source' : 'sources'}
        </span>
      </>
    )}
  </CollapsibleTrigger>
)

export type SourcesContentProps = ComponentProps<typeof CollapsibleContent>

export const SourcesContent = ({
  className,
  ...props
}: SourcesContentProps) => (
  <CollapsibleContent
    className={cn(
      'h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none',
      className
    )}
    {...props}
  />
)

export type SourceProps = ComponentProps<'a'>

export const Source = ({
  href,
  title,
  children,
  className,
  ...props
}: SourceProps) => (
  <a
    className={cn('text-primary underline-offset-4 hover:underline', className)}
    href={href}
    rel='noreferrer noopener'
    target='_blank'
    {...props}
  >
    {children ?? title}
  </a>
)
