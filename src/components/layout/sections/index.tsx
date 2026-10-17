import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type SectionProps = {
  /**
   * Takes the leftover screen height in place of the shell's PageFill. It
   * still grows with taller content; `contain` holds it to exactly the
   * leftover height so the content scrolls inside instead (guestbook)
   */
  fill?: boolean | 'contain'
  sectionClassName?: string
} & HTMLAttributes<HTMLDivElement>

export const Cross = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'pointer-events-none absolute -bottom-2 z-10 hidden size-[15px] sm:block',
      className
    )}
  >
    <span className='absolute top-0 left-[7px] h-full w-px bg-border' />
    <span className='absolute top-[7px] left-0 h-px w-full bg-border' />
  </div>
)

export const Section = ({
  children,
  fill = false,
  sectionClassName,
  className,
  ...props
}: SectionProps) => (
  <section
    className={cn(
      'overflow-x-clip',
      fill && 'flex min-h-[28rem] grow flex-col',
      fill === 'contain' && 'basis-0',
      sectionClassName
    )}
    data-fill={fill || undefined}
    data-slot='section'
    {...props}
  >
    <div
      className={cn(
        'container relative mx-auto',
        fill && 'flex min-h-0 flex-1 flex-col'
      )}
    >
      <div
        className={cn(
          'border-border border-dashed sm:border-x',
          fill && 'flex min-h-0 flex-1 flex-col',
          className
        )}
      >
        {children}
      </div>
      <Cross className='-left-[7px]' />
      <Cross className='-right-[7px]' />
    </div>
  </section>
)
