// Adapted from chanhdai.com (MIT, (c) Chanh Dai): https://github.com/ncdai/chanhdai.com
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Panel({ className, ...props }: ComponentProps<'section'>) {
  return (
    <section
      className={cn(
        'screen-line-top screen-line-bottom border-line border-x',
        className
      )}
      data-slot='panel'
      {...props}
    />
  )
}

export function PanelHeader({ className, ...props }: ComponentProps<'header'>) {
  return (
    <header
      className={cn(
        'screen-line-bottom flex items-center gap-3 px-4 py-2',
        className
      )}
      data-slot='panel-header'
      {...props}
    />
  )
}

export function PanelTitle({ className, ...props }: ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'font-heading font-medium text-2xl tracking-tight sm:text-3xl',
        className
      )}
      data-slot='panel-title'
      {...props}
    />
  )
}

export function PanelTitleSup({ className, ...props }: ComponentProps<'sup'>) {
  return (
    <sup
      className={cn(
        '-top-[0.75em] ml-1 font-mono text-muted-foreground text-xs tracking-normal',
        className
      )}
      {...props}
    />
  )
}

export function PanelAction({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'ml-auto font-mono text-muted-foreground text-xs',
        className
      )}
      {...props}
    />
  )
}

export function PanelContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('p-4', className)} data-slot='panel-body' {...props} />
  )
}
