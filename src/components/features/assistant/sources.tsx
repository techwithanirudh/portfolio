'use client'

import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export type SourcesProps = ComponentProps<'details'>

export const Sources = ({ className, ...props }: SourcesProps) => (
  <details className={cn('not-prose text-base', className)} {...props} />
)

export type SourcesTriggerProps = ComponentProps<'summary'> & {
  count: number
}

export const SourcesTrigger = ({
  className,
  count,
  children,
  ...props
}: SourcesTriggerProps) => (
  <summary className={cn('flex items-center gap-2', className)} {...props}>
    {children ?? <p className='font-medium text-base'>Used {count} sources</p>}
  </summary>
)

export type SourcesContentProps = ComponentProps<'div'>

export const SourcesContent = ({
  className,
  ...props
}: SourcesContentProps) => (
  <div
    className={cn(
      'mt-3 flex w-fit flex-col gap-2 text-primary text-sm outline-none',
      className
    )}
    {...props}
  />
)

export type SourceProps = ComponentProps<'a'>

export const Source = ({ href, title, children, ...props }: SourceProps) => (
  <a
    className='flex items-center gap-2'
    href={href}
    rel='noreferrer noopener'
    target='_blank'
    {...props}
  >
    {children ?? <span className='block font-medium'>{title}</span>}
  </a>
)
