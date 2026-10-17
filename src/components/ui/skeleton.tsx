import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-foreground/8 dark:bg-muted', className)}
      data-slot='skeleton'
      {...props}
    />
  )
}

export { Skeleton }
