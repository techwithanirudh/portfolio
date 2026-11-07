import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// One shell for every live demo on a page: a framed stage, an optional row of
// controls tucked inside the frame, and a short caption underneath. The stage
// and the controls sit 6px in from a 16px frame, so their 10px corners stay
// concentric with it.
export function DemoCard({
  caption,
  children,
  className,
  controls,
  stageClassName,
}: {
  caption?: ReactNode
  children: ReactNode
  className?: string
  controls?: ReactNode
  stageClassName?: string
}) {
  return (
    <figure className={cn('not-prose my-8', className)} data-slot='demo-card'>
      <div className='rounded-2xl border border-border border-dashed bg-muted/40 p-1.5'>
        <div
          className={cn(
            'relative overflow-hidden rounded-[10px] bg-card outline outline-black/10 -outline-offset-1 dark:outline-white/10',
            stageClassName
          )}
          data-slot='demo-card-stage'
        >
          {children}
        </div>
        {controls && (
          <div
            className='mt-1.5 flex flex-wrap items-center gap-1.5'
            data-slot='demo-card-controls'
          >
            {controls}
          </div>
        )}
      </div>
      {caption && (
        <figcaption className='mt-3 text-pretty text-muted-foreground text-sm'>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// A control bar button, sized for thumbs (44px tall) on every screen
export function DemoCardButton({
  active,
  children,
  className,
  ...props
}: React.ComponentProps<'button'> & { active?: boolean }) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        'inline-flex h-11 min-w-11 select-none items-center justify-center gap-2 rounded-[10px] bg-card px-4 font-medium text-muted-foreground text-sm shadow-xs outline-none ring-1 ring-black/8 transition-[color,background-color,box-shadow,scale,opacity] duration-150 ease-out-strong hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50 aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:ring-transparent dark:ring-white/10 [&_svg]:size-4 [&_svg]:shrink-0',
        className
      )}
      type='button'
      {...props}
    >
      {children}
    </button>
  )
}
