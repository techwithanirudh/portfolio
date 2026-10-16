import type { HTMLAttributes } from 'react'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

type SectionProps = {
  /** Takes the leftover screen height in place of the shell's PageFill */
  fill?: boolean
  sectionClassName?: string
} & HTMLAttributes<HTMLDivElement>

// 15px box whose 1px arms land exactly on the 1px grid lines it marks
export const Cross = ({ className }: { className?: string }) => (
  <ViewAnimation
    className={cn(
      'pointer-events-none absolute -bottom-2 z-10 hidden size-[15px] sm:block',
      className
    )}
  >
    <span className='absolute top-0 left-[7px] h-full w-px bg-border' />
    <span className='absolute top-[7px] left-0 h-px w-full bg-border' />
  </ViewAnimation>
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
      fill && 'flex min-h-[28rem] flex-1 basis-0 flex-col',
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
