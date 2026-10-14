import type { HTMLAttributes } from 'react'
import { Icons } from '@/components/icons/icons'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

type SectionProps = {
  sectionClassName?: string
} & HTMLAttributes<HTMLDivElement>

const Cross = () => (
  <ViewAnimation
    className='flex h-6 w-6 items-center justify-center'
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
  >
    <Icons.add className='size-5 text-border/70 dark:text-border' />
  </ViewAnimation>
)

export const Section = ({
  children,
  sectionClassName,
  className,
  ...props
}: SectionProps) => (
  <section className={sectionClassName} {...props}>
    <div className='container relative mx-auto'>
      <div className={cn('border-border border-dashed sm:border-x', className)}>
        {children}
      </div>
      <div className='absolute -bottom-3 -left-3 z-10 hidden h-6 sm:block'>
        <Cross />
      </div>
      <div className='absolute -right-3 -bottom-3 z-10 hidden h-6 -translate-x-px sm:block'>
        <Cross />
      </div>
    </div>
  </section>
)
