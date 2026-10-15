// Adapted from chanhdai.com/src/features/portfolio/components/panel.tsx (MIT, © 2026 Chánh Đại). See ../NOTICES.md
import type React from 'react'
import { cn } from '@/lib/utils'

/**
 * A section of the sheet. The sheet column already draws the verticals, so
 * unlike the original the panel only carries the full-bleed horizontals.
 */
function Panel({ className, ...props }: React.ComponentProps<'section'>) {
  return (
    <section
      className={cn('screen-line-top screen-line-bottom', className)}
      data-slot='panel'
      {...props}
    />
  )
}

function PanelHeader({ className, ...props }: React.ComponentProps<'header'>) {
  return (
    <header
      className={cn(
        'screen-line-bottom flex flex-wrap items-end justify-between gap-x-6 gap-y-2 px-4 pt-6 pb-4 md:px-6',
        className
      )}
      data-slot='panel-header'
      {...props}
    />
  )
}

function PanelTitle({
  as: Comp = 'h2',
  className,
  ...props
}: React.ComponentProps<'h2'> & { as?: 'h1' | 'h2' | 'div' }) {
  return (
    <Comp
      className={cn(
        'group/panel-title text-balance font-semibold text-[28px] leading-[1.15] tracking-[-0.02em]',
        className
      )}
      data-slot='panel-title'
      {...props}
    />
  )
}

function PanelTitleSup({ className, ...props }: React.ComponentProps<'sup'>) {
  return (
    <sup
      className={cn(
        'top-[-1.1em] ml-1.5 font-medium font-mono text-(--ink-muted) text-xs tracking-normal',
        className
      )}
      {...props}
    />
  )
}

/** Right-hand side of a header: a mono readout or a link to another sheet. */
function PanelMeta({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'ds-label flex flex-wrap items-center gap-x-3 gap-y-1 pb-1',
        className
      )}
      data-slot='panel-meta'
      {...props}
    />
  )
}

function PanelDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'max-w-[62ch] text-balance text-(--ink-muted) text-base',
        className
      )}
      data-slot='panel-description'
      {...props}
    />
  )
}

function PanelContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('p-4 md:p-6', className)}
      data-slot='panel-body'
      {...props}
    />
  )
}

export {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelMeta,
  PanelTitle,
  PanelTitleSup,
}
