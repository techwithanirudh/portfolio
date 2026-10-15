import { cn } from '@/lib/utils'

/**
 * A boxed plus that becomes a minus while its Collapsible is open. Reads the
 * `data-state` of the nearest `group/toggle` ancestor (the trigger).
 */
export function ToggleGlyph({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'relative inline-block size-4 shrink-0 rounded-[2px] border border-(--line-strong) bg-(--sheet) text-(--ink-muted) transition-colors group-hover/toggle:border-(--ink) group-hover/toggle:text-(--ink)',
        className
      )}
    >
      <span className='absolute top-1/2 left-[3px] h-px w-2 -translate-y-1/2 bg-current' />
      <span className='absolute top-[3px] left-1/2 h-2 w-px -translate-x-1/2 bg-current transition-transform duration-200 group-data-[state=open]/toggle:scale-y-0' />
    </span>
  )
}
