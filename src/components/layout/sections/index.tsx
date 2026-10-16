import type { HTMLAttributes } from 'react'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

type SectionProps = {
  sectionClassName?: string
} & HTMLAttributes<HTMLDivElement>

// 15px box whose 1px arms land exactly on the 1px grid lines it marks
const Cross = ({ className }: { className?: string }) => (
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
  sectionClassName,
  className,
  ...props
}: SectionProps) => (
  <section className={sectionClassName} data-slot='section' {...props}>
    <div className='container relative mx-auto'>
      <div className={cn('border-border border-dashed sm:border-x', className)}>
        {children}
      </div>
      <Cross className='-left-[7px]' />
      <Cross className='-right-[7px]' />
    </div>
  </section>
)
