// Adapted from chanhdai.com (MIT, (c) Chanh Dai): https://github.com/ncdai/chanhdai.com
import Link from 'next/link'
import type { ComponentProps } from 'react'
import { Icons } from '@/components/icons/icons'
import { buttonVariants } from '@/components/ui/button'
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
        '-top-[0.9em] ml-0.5 font-mono text-muted-foreground text-xs tracking-normal',
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

// Full-width square button that sits flush on the panel's bottom edge
export function PanelButton({
  className,
  children,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        buttonVariants({ shape: 'square', variant: 'default' }),
        'h-auto w-full py-5 ring-0 active:scale-100 active:opacity-90',
        className
      )}
      data-slot='panel-button'
      {...props}
    >
      {children}
      <Icons.arrowRight className='icon-arrow-button size-4' />
    </Link>
  )
}
