import { cn } from '@/lib/utils'

function Empty({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg p-6 text-center',
        className
      )}
      data-slot='empty'
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex max-w-sm flex-col items-center gap-1.5 text-center',
        className
      )}
      data-slot='empty-header'
      {...props}
    />
  )
}

function EmptyMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'mb-1 flex size-10 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground [&_svg]:size-5',
        className
      )}
      data-slot='empty-media'
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('font-medium text-sm', className)}
      data-slot='empty-title'
      {...props}
    />
  )
}

function EmptyDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn('text-muted-foreground text-sm', className)}
      data-slot='empty-description'
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex items-center justify-center gap-2', className)}
      data-slot='empty-content'
      {...props}
    />
  )
}

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
}
