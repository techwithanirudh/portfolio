import { cn } from '@/lib/utils'

function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-6 select-none items-center justify-center gap-1 rounded-sm px-1 font-normal font-sans text-muted-foreground text-sm/none [&_svg:not([class*='size-'])]:size-3",
        'bg-black/5 shadow-[inset_0_-1px_2px] shadow-black/10 dark:bg-white/10 dark:shadow-white/10',
        'in-data-[slot=tooltip-content]:bg-white/20 in-data-[slot=tooltip-content]:text-background in-data-[slot=tooltip-content]:shadow-white/20 dark:in-data-[slot=tooltip-content]:bg-black/10 dark:in-data-[slot=tooltip-content]:shadow-black/10',
        className
      )}
      data-slot='kbd'
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <kbd
      className={cn('inline-flex items-center gap-1', className)}
      data-slot='kbd-group'
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
